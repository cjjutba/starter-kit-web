import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// docs/engineering/environments.md: .env.example is the list of everything,
// and when a variable is added it goes there first. It did not, once. Config,
// setup and the environments doc all read NEXT_PUBLIC_CONTACT_EMAIL for a
// version while the example never listed it. So the example is checked
// against every process.env read in the code that ships.

// Variables the platform sets, with the reason each is not in the example.
const platform = new Map([
  ["NODE_ENV", "set by Next"],
  ["NEXT_RUNTIME", "set by Next inside instrumentation"],
  ["CI", "set by GitHub Actions"],
  ["VERCEL_ENV", "set by Vercel, names the environment in error reports"],
  ["VERCEL_URL", "set by Vercel per deployment"],
  ["VERCEL_BRANCH_URL", "set by Vercel per branch"],
  ["VERCEL_PROJECT_PRODUCTION_URL", "set by Vercel, the production alias auth allows"],
  ["VERCEL", "set by Vercel on every build and function, picks https for auth"],
  ["PORT", "set by the Playwright config for its own server"],
  ["E2E_BASE_URL", "points the axe run at a deployment instead of a local server"],
]);

const rootConfigs = readdirSync(".").filter((file) => /\.(ts|mts|mjs)$/.test(file));
const files = [...walk("src"), ...walk("scripts"), ...rootConfigs].filter((file) => /\.(ts|tsx|mts|mjs)$/.test(file));

const declared = new Set(
  readFileSync(".env.example", "utf8")
    .split("\n")
    .flatMap((line) => (/^[A-Z][A-Z0-9_]*=/.test(line) ? [line.split("=")[0]] : [])),
);

describe("every variable the code reads is in .env.example", () => {
  it("lists each process.env read, or explains why the platform owns it", () => {
    const missing = files.flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)]
        .map((match) => match[1])
        .filter((name) => !declared.has(name) && !platform.has(name))
        .map((name) => `${name} read in ${file}`),
    );
    expect([...new Set(missing)]).toEqual([]);
  });

  it("keeps the platform list honest, so an entry cannot outlive its use", () => {
    const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
    const unused = [...platform.keys()].filter((name) => !source.includes(`process.env.${name}`));
    expect(unused).toEqual([]);
  });
});
