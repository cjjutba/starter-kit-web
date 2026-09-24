import { lt, sql } from "drizzle-orm";
import { db as defaultDb, type Database } from "../db/client";
import { rateLimits } from "../db/schema";
import { secondsAfter, secondsBefore, secondsUntil } from "../time";

// A fixed window counter in Postgres, because the free tier has no Redis and
// a public form needs something. One upsert per check: a window that has
// expired restarts at one, otherwise the count goes up.

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export async function rateLimit(
  scope: string,
  identifier: string,
  max: number,
  windowSeconds: number,
  db: Database = defaultDb,
): Promise<RateLimitResult> {
  const key = `${scope}:${identifier}`;
  const now = new Date();
  const oldestLiveStart = secondsBefore(windowSeconds, now);

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: now })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.windowStart} < ${oldestLiveStart} then 1 else ${rateLimits.count} + 1 end`,
        windowStart: sql`case when ${rateLimits.windowStart} < ${oldestLiveStart} then ${now} else ${rateLimits.windowStart} end`,
      },
    })
    .returning();

  if (row.count <= max) return { allowed: true };
  const retryAfterSeconds = Math.max(1, secondsUntil(secondsAfter(windowSeconds, row.windowStart), now));
  return { allowed: false, retryAfterSeconds };
}

/**
 * The caller's address, in the same order Better Auth reads it in
 * src/lib/auth/server.ts. Vercel sets x-real-ip to the caller. The first
 * x-forwarded-for entry is what the client sent, so it only counts when
 * nothing better exists. "unknown" when neither is set.
 */
export function clientIp(headers: Headers): string {
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

/** Deletes counters whose window started longer ago than this. Returns the count. */
export async function purgeRateLimits(olderThanSeconds: number, db: Database = defaultDb): Promise<number> {
  const cutoff = secondsBefore(olderThanSeconds);
  const rows = await db.delete(rateLimits).where(lt(rateLimits.windowStart, cutoff)).returning({ key: rateLimits.key });
  return rows.length;
}
