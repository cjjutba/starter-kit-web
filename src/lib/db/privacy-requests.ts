import { and, asc, eq, lt } from "drizzle-orm";
import { daysBefore } from "../time";
import { db as defaultDb, type Database } from "./client";
import { privacyRequests } from "./schema";

// The deletion request record. Shared, no tenant data: the person asking
// may not even have an account. The public action records first and mails
// second, so a request survives the mail purge and a mail provider outage.
// pnpm privacy:requests lists what is open.

export async function recordPrivacyRequest(input: { email: string; message: string }, db: Database = defaultDb): Promise<string> {
  const [row] = await db.insert(privacyRequests).values(input).returning({ id: privacyRequests.id });
  return row.id;
}

export async function listOpenPrivacyRequests(db: Database = defaultDb) {
  return db.select().from(privacyRequests).where(eq(privacyRequests.status, "open")).orderBy(asc(privacyRequests.createdAt));
}

/** Marks a request handled. False when there was no open request with that id. */
export async function markPrivacyRequestDone(id: string, db: Database = defaultDb): Promise<boolean> {
  const rows = await db
    .update(privacyRequests)
    .set({ status: "done", handledAt: new Date() })
    .where(and(eq(privacyRequests.id, id), eq(privacyRequests.status, "open")))
    .returning({ id: privacyRequests.id });
  return rows.length > 0;
}

/**
 * Deletes requests handled longer ago than this. The privacy notice keeps a
 * handled request for a year as the record that it was made and done, and
 * no longer. Open requests are never purged. Returns the count.
 */
export async function purgeHandledPrivacyRequests(olderThanDays: number, db: Database = defaultDb): Promise<number> {
  const rows = await db
    .delete(privacyRequests)
    .where(and(eq(privacyRequests.status, "done"), lt(privacyRequests.handledAt, daysBefore(olderThanDays))))
    .returning({ id: privacyRequests.id });
  return rows.length;
}
