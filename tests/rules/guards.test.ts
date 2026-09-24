import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// AGENTS.md: the proxy is optimistic and the real check is in every page and
// action. The layout covers pages. Actions are exported functions a browser
// can call by name, so each one has to check for itself, and this is the
// test that notices when one does not.
//
// The same file holds the other two guards a stranger could walk past: a
// public write path follows the honeypot and rate limit pattern in
// src/app/privacy/request/actions.ts, and a cron route checks CRON_SECRET.

// Comments out, so a require call mentioned in a comment does not count.
function code(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/** Each exported action and the code up to the next export, in either declaration form. */
function exportedActions(file: string): { name: string; body: string }[] {
  const source = code(readFileSync(file, "utf8"));
  const parts = source.split(/^export (?=async function |const \w+ = async)/m).slice(1);
  return parts.map((part) => ({ name: part.match(/^(?:async function|const) (\w+)/)?.[1] ?? "unknown", body: part }));
}

// Every file that declares server actions. conventions.md keeps them in
// actions.ts beside the page, so the checks below know where to look.
const serverFiles = walk("src").filter((file) => /\.(ts|tsx)$/.test(file) && /^\s*["']use server["']/m.test(code(readFileSync(file, "utf8"))));

describe("every server action checks who is calling", () => {
  const appActions = serverFiles.filter((file) => file.startsWith("src/app/app/"));

  it("keeps every server action in an actions.ts file", () => {
    expect(serverFiles.filter((file) => !file.endsWith("/actions.ts"))).toEqual([]);
  });

  it("has at least one action file under the app, so the rule is exercised", () => {
    expect(appActions.length).toBeGreaterThan(0);
  });

  it("calls requireOrganisation or requireSession in every action under src/app/app", () => {
    const unguarded = appActions.flatMap((file) =>
      exportedActions(file)
        .filter(({ body }) => !/require(Organisation|Session)\(/.test(body))
        .map(({ name }) => `${name} in ${file}`),
    );
    expect(unguarded).toEqual([]);
  });

  it("guards every public action with the honeypot and the rate limit", () => {
    const publicActions = serverFiles.filter((file) => !file.startsWith("src/app/app/"));
    const unguarded = publicActions.flatMap((file) =>
      exportedActions(file)
        .filter(({ body }) => !body.includes("isBot(") || !body.includes("rateLimit("))
        .map(({ name }) => `${name} in ${file}`),
    );
    expect(unguarded).toEqual([]);
  });

  it("checks CRON_SECRET in every job route", () => {
    const jobs = walk("src/app/api/jobs").filter((file) => file.endsWith("/route.ts"));
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.filter((file) => !readFileSync(file, "utf8").includes("CRON_SECRET"))).toEqual([]);
  });
});
