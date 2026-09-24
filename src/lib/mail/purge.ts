import { lt } from "drizzle-orm";
import { db as defaultDb, type Database } from "../db/client";
import { mailLog } from "../db/schema";
import { daysBefore } from "../time";

/** Deletes logged mail older than the given number of days. Returns the count. */
export async function purgeMailLog(olderThanDays: number, db: Database = defaultDb): Promise<number> {
  const rows = await db.delete(mailLog).where(lt(mailLog.createdAt, daysBefore(olderThanDays))).returning({ id: mailLog.id });
  return rows.length;
}
