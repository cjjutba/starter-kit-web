import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";

describe("safeNext keeps redirects on this site", () => {
  it("passes a local path with its query and hash", () => {
    expect(safeNext("/app/notes?page=2#top")).toBe("/app/notes?page=2#top");
  });

  it.each(["//evil.com", "/\\evil.com", "/\\/evil.com", "/\tevil.com", "https://evil.com", "evil.com", "", "javascript:alert(1)"])(
    "falls back for %j",
    (value) => {
      expect(safeNext(value)).toBe("/app");
    },
  );

  it("falls back for anything that is not a string", () => {
    expect(safeNext(undefined)).toBe("/app");
    expect(safeNext(["/app/notes"], "/")).toBe("/");
  });
});
