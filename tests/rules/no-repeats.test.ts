import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { withoutManagedBlock } from "../docs";
import { walk } from "../walk";

// docs/README.md: every fact lives in one file, and other files link to it.
// A sentence written twice costs tokens on every read and drifts the day one
// copy changes. Short lines repeat on purpose, such as "End the turn." in
// each skill, because a loaded skill has to act without opening another
// file, so only sentences of ten words or more are held to the rule. A
// close paraphrase counts too: two sentences sharing half their three word
// runs say the same thing.

const minWords = 10;
const similar = 0.5;

// A deliberate repeat, with the reason it cannot be a link. Keep this short.
const allowed = new Set<string>([]);

const files = ["AGENTS.md", "DESIGN.md", "README.md", ...walk("docs"), ...walk(".claude/skills")].filter(
  (file) => file.endsWith(".md") && !file.includes("explorations/references/"),
);

function normalise(sentence: string): string {
  return sentence
    .toLowerCase()
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, " ")
    .replace(/^\s*(\d+\.|-)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every sentence of prose in a markdown file, with the line its block starts on. */
export function sentences(source: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  let block: string[] = [];
  let blockLine = 0;
  let fenced = false;
  const flush = () => {
    const text = block.join(" ");
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const normal = normalise(sentence);
      if (normal.split(" ").length >= minWords) out.push({ line: blockLine, text: normal });
    }
    block = [];
  };
  withoutManagedBlock(source)
    .split("\n")
    .forEach((raw, index) => {
      const line = raw.trimEnd();
      if (/^\s*```/.test(line)) {
        flush();
        fenced = !fenced;
        return;
      }
      if (fenced) return;
      const starts = line.trim() === "" || /^\s*(#|\||-|\d+\.)\s/.test(line) || /^\s*</.test(line);
      if (starts) flush();
      if (line.trim() === "" || /^\s*#/.test(line)) return;
      if (block.length === 0) blockLine = index + 1;
      block.push(line.trim());
      if (/^\s*\|/.test(line)) flush();
    });
  flush();
  return out;
}

function trigrams(text: string): Set<string> {
  const words = text.replace(/[^a-z0-9 ]/g, "").split(" ");
  const out = new Set<string>();
  for (let i = 0; i + 2 < words.length; i++) out.add(words.slice(i, i + 3).join(" "));
  return out;
}

function overlap(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const gram of a) if (b.has(gram)) shared++;
  return shared / (a.size + b.size - shared);
}

describe("no sentence is written twice across the docs and skills", () => {
  it("finds every repeat and close paraphrase", () => {
    const all = files.flatMap((file) =>
      sentences(readFileSync(file, "utf8"))
        .filter(({ text }) => !allowed.has(text))
        .map((sentence) => ({ file, ...sentence, grams: trigrams(sentence.text) })),
    );
    const repeats: string[] = [];
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const [a, b] = [all[i], all[j]];
        if (a.text === b.text || overlap(a.grams, b.grams) >= similar) {
          repeats.push(`${b.file}:${b.line} repeats ${a.file}:${a.line}: "${b.text.slice(0, 90)}"`);
        }
      }
    }
    expect(repeats, "Keep the sentence in the file that owns the fact and link to it from the other.").toEqual([]);
  });

  it("reads enough prose that the rule is exercised", () => {
    const total = files.reduce((count, file) => count + sentences(readFileSync(file, "utf8")).length, 0);
    expect(total).toBeGreaterThan(500);
  });
});
