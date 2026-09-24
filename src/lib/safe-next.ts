const base = "http://local.invalid";

/**
 * A redirect target from the query string, or the fallback when it is not a
 * path on this site. Parsing with the URL constructor is the check, because
 * browsers read "/\evil.com" and "/%09/evil.com" as another host while a
 * prefix test does not.
 */
export function safeNext(value: unknown, fallback = "/app"): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  // Control characters and backslashes never belong in a path we send people to.
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return fallback;
  let url: URL;
  try {
    url = new URL(value, base);
  } catch {
    return fallback;
  }
  if (url.origin !== base) return fallback;
  return url.pathname + url.search + url.hash;
}
