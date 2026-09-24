# Tooling

What each skill expects to find, and what to do when it is
missing.

## MCP servers

Registered at user scope in Claude Code, so every repo gets them. Nothing about them lives in this repo. `/setup` checks each one
it needs with ToolSearch before it starts and stops with the fix.

| Server | Used by | Fallback when down |
| --- | --- | --- |
| Neon | `setup`, `feature` when a branch is needed | The `neon` CLI, or the dashboard for a connection string |
| Vercel | `setup`, `feature` for deploy status | The `vercel` CLI, which is required anyway |
| Better Auth docs | anything touching `src/lib/auth` | The docs site |
| Context7 | any library question | The library's docs |
| fal | `image` | The HTTP endpoint with `FAL_KEY`, see the skill |
| Browser preview or Chrome DevTools | `verify`, `setup` | Playwright through `pnpm test:e2e` |

The Vercel server comes from the Vercel plugin and needs a one time sign in
through `/mcp` in an interactive session. GitHub is driven by the `gh` CLI,
not an MCP.

## Local requirements

Node 22 or later, and `.node-version` says 24 so Vercel and CI match. The
Better Auth CLI fails on Node 20. pnpm 8, pinned in `package.json`. The
`gh`, `vercel` and `openssl` CLIs signed in.

## Skills in this repo

`.claude/skills/` holds `intake`, `setup`, `plan`, `feature`, `verify` and `image`.
They travel with the repo, so every project made from the template has
them. `skills-lock.json` lists the Neon skills that reinstall from their
own repository rather than being vendored.

## Error reports

Sentry needs nothing locally. An empty DSN
loads nothing. Production sets `NEXT_PUBLIC_SENTRY_DSN` when it wants
reports.

## Permissions

`.claude/settings.json` allows the commands the skills run: pnpm, node,
`git status`, `diff`, `log`, `add`, `commit`, `push` and `switch`, `gh`,
`vercel` and `openssl rand`. Nothing that discards work is on the list, so
a reset, a checkout of a file or a force push still asks.
