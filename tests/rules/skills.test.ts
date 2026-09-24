import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// README, workflow.md and tooling.md each said "six skills" for a version
// after the seventh landed, so an agent reading any of them looked for six.
// Every skill folder is named where people and agents look for the list,
// and no doc states the count in words, because a count is the part that
// goes stale first.

const skills = readdirSync(".claude/skills", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// AGENTS.md for agents, the README for people. Everything else points at
// AGENTS.md rather than keeping a third copy.
const lists = ["README.md", "AGENTS.md"];
const docs = ["README.md", "AGENTS.md", "docs/workflow.md", "docs/engineering/tooling.md", "docs/README.md"];
const count = /\b(two|three|four|five|six|seven|eight|nine|ten) (Claude Code )?skills\b|\bthe (two|three|four|five|six|seven|eight|nine|ten)\b:|there are (two|three|four|five|six|seven|eight|nine|ten)\b/i;

describe("every skill is listed and none is counted", () => {
  it("finds the skills, so the rule is exercised", () => {
    expect(skills.length).toBeGreaterThan(3);
  });

  for (const file of lists) {
    it(`${file} names every skill in .claude/skills`, () => {
      const text = readFileSync(file, "utf8");
      const missing = skills.filter((skill) => !text.includes(`\`${skill}\``) && !text.includes(`\`/${skill}`));
      expect(missing, `skills ${file} does not name`).toEqual([]);
    });
  }

  it("states no skill count in words", () => {
    const counted = docs.filter((file) => count.test(readFileSync(file, "utf8")));
    expect(counted, "say \"the skills\" and list them instead").toEqual([]);
  });
});
