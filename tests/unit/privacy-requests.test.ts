import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { listOpenPrivacyRequests, markPrivacyRequestDone, purgeHandledPrivacyRequests, recordPrivacyRequest } from "@/lib/db/privacy-requests";
import { purgeRateLimits } from "@/lib/guard/rate-limit";

// The deletion request record and the counter purge, against an in-process
// Postgres. A request has to outlive the mail about it, and a counter has
// to go once its window is long gone.

const client = new PGlite();
const db = drizzle({ client, schema });

beforeAll(async () => {
  const { apply } = await pushSchema(schema, db as unknown as Parameters<typeof pushSchema>[1]);
  await apply();
});

afterAll(async () => {
  await client.close();
});

describe("privacy requests", () => {
  it("records a request, lists it while open, and drops it from the list once handled", async () => {
    const id = await recordPrivacyRequest({ email: "ana@example.com", message: "Everything, please." }, db);
    const open = await listOpenPrivacyRequests(db);
    expect(open.map((row) => row.id)).toEqual([id]);
    expect(open[0].status).toBe("open");

    expect(await markPrivacyRequestDone(id, db)).toBe(true);
    expect(await listOpenPrivacyRequests(db)).toEqual([]);
    expect(await markPrivacyRequestDone(id, db), "a handled request is not handled again").toBe(false);
    expect(await markPrivacyRequestDone("no-such-request", db)).toBe(false);
  });
});

describe("privacy request purge", () => {
  it("deletes handled requests past the year and never an open one", async () => {
    const longAgo = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    await db.insert(schema.privacyRequests).values([
      { email: "old@example.com", status: "done", handledAt: longAgo },
      { email: "waiting@example.com", createdAt: longAgo },
    ]);
    expect(await purgeHandledPrivacyRequests(365, db)).toBe(1);
    const left = await db.select({ email: schema.privacyRequests.email }).from(schema.privacyRequests);
    expect(left.map((row) => row.email)).not.toContain("old@example.com");
    expect(left.map((row) => row.email)).toContain("waiting@example.com");
  });
});

describe("rate limit purge", () => {
  it("deletes only counters whose window started before the cutoff", async () => {
    const now = new Date();
    await db.insert(schema.rateLimits).values([
      { key: "old", count: 3, windowStart: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
      { key: "fresh", count: 1, windowStart: now },
    ]);
    expect(await purgeRateLimits(60 * 60 * 24, db)).toBe(1);
    const left = await db.select({ key: schema.rateLimits.key }).from(schema.rateLimits);
    expect(left.map((row) => row.key)).toEqual(["fresh"]);
  });
});
