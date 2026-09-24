import { config as loadEnv } from "dotenv";
import { defineConfig } from "@playwright/test";

// The app reads .env.local through Next, but this file runs in plain Node, so
// it has to load it too or the check below fires on a correctly set up
// project. dotenv does not overwrite what is already set, so CI still wins.
loadEnv({ path: ".env.local", quiet: true });

// The axe smoke test. Points at a running app when E2E_BASE_URL is set,
// otherwise starts the production build on PORT, default 3000.

const port = process.env.PORT ?? "3000";
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

// Without a secret Better Auth throws while rendering, the auth pages fall back
// to the error boundary, and axe reports four colour contrast failures on
// elements that are not the problem. Fail here instead, where the cause is
// readable. Only when this config starts the server; a deployed target carries
// its own environment.
if (!process.env.E2E_BASE_URL && !process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is missing, so /sign-in and /sign-up would render the error boundary and axe would blame the wrong elements. Copy .env.example to .env.local and fill it, or export the variable for this run.",
  );
}

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `pnpm start --port ${port}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [
    { name: "light", use: { browserName: "chromium", colorScheme: "light" } },
    // Only axe depends on the scheme. The modal and header specs prove the
    // same thing in either, so they run once.
    { name: "dark", use: { browserName: "chromium", colorScheme: "dark" }, testMatch: /axe\.spec\.ts/ },
  ],
});
