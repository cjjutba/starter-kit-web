import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// DESIGN.md: contrast passes WCAG AA, and the table at the bottom is checked
// when a value changes. Checked by hand means checked sometimes, so this
// computes every pair the table lists, in both schemes, from the tokens in
// globals.css. It is also what makes an accent safe to add: change the
// action tokens, run pnpm test, and a pair that fell under the line fails
// the build with its ratio in the message.
//
// The pairs are data. Add a row when a token gains a new surface to sit on.

const css = readFileSync("src/app/globals.css", "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`${selector} block not found in globals.css`);
  const end = css.indexOf("}", start);
  const tokens: Record<string, string> = {};
  for (const match of css.slice(start, end).matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

function luminance(hex: string): number {
  const channel = (index: number) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

// [foreground, background, minimum, reason]. 4.5 is AA for text, 3 is AA
// for a non text indicator such as the focus ring, and 2 is the floor for a
// placeholder, which the label carries the meaning for.
const pairs: [string, string, number, string?][] = [
  ["text", "page", 4.5],
  ["text", "sheet", 4.5],
  ["text", "field", 4.5],
  ["text", "tint", 4.5, "tint cards use --text only"],
  ["text", "pill-2", 4.5],
  ["text", "divider", 4.5],
  ["text-2", "page", 4.5],
  ["text-2", "sheet", 4.5],
  ["text-2", "field", 4.5],
  ["text-2", "pill-2", 4.5, "secondary text on the secondary pill"],
  ["text-2", "divider", 4.5, "the header of an open group"],
  ["error", "page", 4.5],
  ["error", "sheet", 4.5],
  ["error", "field", 4.5, "helper text under a field"],
  ["error", "pill-2", 4.5, "the danger pill"],
  ["on-action", "action", 4.5, "the primary pill label"],
  ["on-action", "action-pressed", 4.5],
  ["focus", "page", 3, "focus ring, non text"],
  ["focus", "sheet", 3, "focus ring, non text"],
  ["text-3", "field", 2, "placeholder only"],
  ["text-3", "sheet", 2, "placeholder only"],
];

const schemes = { light: block(":root"), dark: block(".dark") };

function ratioOf(tokens: Record<string, string>, foreground: string, background: string): number {
  return contrast(tokens[foreground], tokens[background]);
}

describe("every token pair DESIGN.md relies on clears its line", () => {
  for (const [scheme, tokens] of Object.entries(schemes)) {
    for (const [foreground, background, minimum, reason] of pairs) {
      it(`${scheme}: --${foreground} on --${background} is at least ${minimum}:1`, () => {
        expect(tokens[foreground], `--${foreground} has no hex value in the ${scheme} block`).toBeDefined();
        expect(tokens[background], `--${background} has no hex value in the ${scheme} block`).toBeDefined();
        const ratio = ratioOf(tokens, foreground, background);
        expect(ratio, `--${foreground} on --${background} in ${scheme} is ${ratio.toFixed(2)}:1${reason ? ` (${reason})` : ""}`).toBeGreaterThanOrEqual(minimum);
      });
    }
  }

  // Computes its own rows, so it runs alone under -t and does not depend on
  // the tests above having run first.
  it("prints the table so DESIGN.md can be refreshed from it", () => {
    const rows = Object.entries(schemes).flatMap(([scheme, tokens]) =>
      pairs
        .filter(([foreground, background]) => tokens[foreground] && tokens[background])
        .map(([foreground, background, , reason]) => `${scheme.padEnd(5)} --${foreground} on --${background}: ${ratioOf(tokens, foreground, background).toFixed(2)}${reason ? `, ${reason}` : ""}`),
    );
    console.log(["Contrast, as computed:", ...rows].join("\n"));
    expect(rows.length).toBe(pairs.length * 2);
  });
});
