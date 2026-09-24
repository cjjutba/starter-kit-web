import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { featureRows } from "../docs";

// docs/progress.md is the first file every session reads, and the skills
// write to it by heading. A tracker missing a section is one the next
// session misreads, and a feature listed there but not in features.md is a
// feature nobody specified.

const progress = readFileSync("docs/progress.md", "utf8");
const features = readFileSync("docs/product/features.md", "utf8");
const sections = ["Phase", "Now", "Features", "Next", "Open questions", "Resume notes"];
const statuses = new Set(["planned", "building", "shipped"]);

describe("the progress tracker keeps its shape", () => {
  it("has every section the skills write to", () => {
    const missing = sections.filter((section) => !new RegExp(`^## ${section}$`, "m").test(progress));
    expect(missing, "sections missing from docs/progress.md").toEqual([]);
  });

  it("lists features only with a known status", () => {
    const rows = featureRows(progress);
    expect(rows.length).toBeGreaterThan(0);
    const bad = rows.filter((row) => !statuses.has(row.status));
    expect(bad, "status must be planned, building or shipped").toEqual([]);
  });

  it("lists only features that docs/product/features.md defines", () => {
    const unknown = featureRows(progress).filter((row) => !new RegExp(`^## ${row.id}\\b`, "m").test(features));
    expect(unknown, "ids in docs/progress.md with no heading in features.md").toEqual([]);
  });
});
