import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { featureRows } from "../docs";

// docs/specs/README.md: /feature writes one spec per feature before it
// builds, and every heading stays. A spec missing a heading is a spec that
// skipped a question, and a feature marked building with no spec is one
// built from a chat message the next session cannot read.

const dir = join("docs", "specs");
const features = readFileSync("docs/product/features.md", "utf8");
const progress = readFileSync("docs/progress.md", "utf8");
const headings = ["Goal", "Design", "Implementation", "Data and tenancy", "Dependencies", "Verify when done", "Review depth"];
const specs = readdirSync(dir).filter((name) => /^F\d+-[a-z0-9-]+\.md$/.test(name));

describe("every feature spec is whole and belongs to a feature", () => {
  it("keeps every heading in the template", () => {
    const template = readFileSync(join(dir, "README.md"), "utf8");
    const missing = headings.filter((heading) => !template.includes(`## ${heading}\n`));
    expect(missing, "headings missing from the template in docs/specs/README.md").toEqual([]);
  });

  for (const name of specs) {
    const id = name.split("-")[0];
    const text = readFileSync(join(dir, name), "utf8");

    it(`${name} has every heading`, () => {
      const missing = headings.filter((heading) => !new RegExp(`^## ${heading}$`, "m").test(text));
      expect(missing, `headings missing from ${name}. Write "None" under one that does not apply.`).toEqual([]);
    });

    it(`${name} is a feature in features.md`, () => {
      expect(features, `no heading for ${id} in docs/product/features.md`).toMatch(new RegExp(`^## ${id}\\b`, "m"));
    });
  }

  it("has a spec for every feature being built or shipped, F0 aside", () => {
    const missing = featureRows(progress)
      .filter((row) => row.id !== "F0" && row.status !== "planned")
      .filter((row) => !specs.some((name) => name.startsWith(`${row.id}-`)))
      .map((row) => row.id);
    expect(missing, "features marked building or shipped in docs/progress.md with no spec").toEqual([]);
  });

  it("has the specs folder", () => {
    expect(existsSync(dir)).toBe(true);
  });
});
