import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { clientIp, rateLimit } from "@/lib/guard/rate-limit";

// The counter against an in-process Postgres, so it runs in CI and writes
// nothing to a real database.

const client = new PGlite();
const db = drizzle({ client, schema }) as unknown as Parameters<typeof rateLimit>[4];

beforeAll(async () => {
  const { apply } = await pushSchema(schema, db as unknown as Parameters<typeof pushSchema>[1]);
  await apply();
});

afterAll(async () => {
  await client.close();
});

describe("rateLimit", () => {
  it("allows up to the limit in a window and then refuses with a retry time", async () => {
    expect(await rateLimit("test", "1.2.3.4", 2, 60, db)).toEqual({ allowed: true });
    expect(await rateLimit("test", "1.2.3.4", 2, 60, db)).toEqual({ allowed: true });
    const third = await rateLimit("test", "1.2.3.4", 2, 60, db);
    expect(third.allowed).toBe(false);
    if (!third.allowed) expect(third.retryAfterSeconds).toBeGreaterThan(0);
    expect(await rateLimit("test", "5.6.7.8", 2, 60, db)).toEqual({ allowed: true });
  });
});

describe("clientIp", () => {
  it("prefers x-real-ip, which Vercel sets, over what the client put in x-forwarded-for", () => {
    expect(clientIp(new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "6.6.6.6, 1.1.1.1" }))).toBe("1.1.1.1");
    expect(clientIp(new Headers({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
