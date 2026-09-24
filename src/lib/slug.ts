/** "Acme Studio!" becomes "acme-studio", and "Renée" becomes "renee". Empty when nothing survives. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** A slug that will not collide: the name slugified, or the fallback, then eight characters of the id. */
export function uniqueSlug(name: string, fallback: string, id: string = crypto.randomUUID()): string {
  return `${slugify(name) || fallback}-${id.slice(0, 8)}`;
}
