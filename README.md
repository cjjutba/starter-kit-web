# starter-kit-web

The repo every new product starts from, so no agent session begins from
scratch. Next.js 16, Postgres on Neon through Drizzle, Better Auth with
organisations, Tailwind v4 with a settled design system, six Claude Code
skills that run the workflow, and a set of rules that fail the build instead
of living in prose.

Real data from the first commit. No mock store, no fixtures driving screens.
One seed that creates one person and their organisation so sign in works.

## Start a product

```bash
gh repo create my-product --template cjjutba/starter-kit-web --private --clone
cd my-product && claude
```

Private is the default because most products are for a client. Add
`--public` for portfolio work. The template itself owns nothing outside
GitHub: no Neon project, no Vercel project, no Sentry, no Resend. `/setup`
wires each of those for the product it makes. Then, inside Claude Code,
paste the brief. The `intake` skill runs on its own, asks until nothing is
open, writes the brief and every answer into `docs/product/intake.md`, and
tells you to type `/setup`. No skill runs because the brief says so, and
every skill stops for a yes before it wires, writes or builds. The six:

| Skill | When | What it does |
| --- | --- | --- |
| `/intake` | When a brief or an amendment arrives | Copies it in, lists what it settles, implies and conflicts with, then asks in rounds until you say nothing is open. Runs itself. |
| `/setup` | Once, first session | Asks, waits for a yes, then names the product, settles its shape and its look, wires Neon and Vercel, migrates, seeds, deploys, writes decision 001. Idempotent. |
| `/plan` | Before feature one | Asks its questions per doc, waits for a yes, then fills the product docs in order and ends with a feature list where each has a "done means" line. |
| `/feature F1` | Per feature | The loop: plan the slice, wait for a yes, design the screen, build, verify, review code and design, fix, PR, merge, production green. |
| `/verify` | Any time | Drives the running app the way a person does. Each feature adds its steps. |
| `/image` | When a board, mark or asset is needed | Writes the prompt from the brief and DESIGN.md, prices it, runs fal, files the result beside its prompt. |

## Run it here

```bash
pnpm install
cp .env.example .env.local   # fill DATABASE_URL and BETTER_AUTH_SECRET
pnpm db:push && pnpm db:seed
pnpm exec playwright install chromium   # once per machine, for the axe run
pnpm dev
```

Then `/design` for the design sheet, `/sign-in` with the seeded person, and
`/app` for the example feature.

## What is in the box

- **Design system.** Tokens in `globals.css` for colour, type, radius and layout, the primitives in `src/components/primitives/`, the shadcn set token mapped, Geist self hosted, dark mode as a token remap. A grey page with white sheets in light, a ladder in dark. An app shell with the organisation at the top, settings that open into sections, and the account at the bottom, the same shape as Kalinga's. `DESIGN.md` explains it, names the four knobs a product turns to look like itself, and `/design` renders it, modals included.
- **Data layer.** A lazy Neon client, a schema where every tenant table carries `organisation_id`, and a scoped query layer that cannot be called without one. The raw handle cannot leave `src/lib/db`, `src/lib/auth`, `src/lib/mail` or `src/lib/guard`.
- **Auth.** Email and password with the address verified before a session exists, sign up open or by invitation, organisations with invitations and their people managed from one page, a personal organisation on sign up, membership checked on every request, an account page with password, email and deletion, sign in that works on preview deployments, and the real check in every page.
- **Mail, guards, cron, errors.** One `send()` with a log provider for everything but production. A Postgres rate limiter, shared with the auth endpoints, and a honeypot on the one public form. Deletion requests recorded and listed from the command line. A purge cron with a secret. Security headers on every response, asserted by a test, with zod on every server action. Sentry for errors, off until a DSN exists. Robots, a sitemap and a link card from the route directory.
- **Rules as tests.** No hex in components, including the url encoded kind inside a data URI. No arbitrary Tailwind values for size, spacing or type, so the tokens stay the source of truth. No dashes in prose or in commit messages. Every table classified, scoped and reachable through the scoped layer. Every token pair over its AA line in both schemes, so an accent cannot ship a failing pair. Every variable the code reads listed in the env example. Every page in the route directory and the pages doc. Every app action checking the session, every public action behind the honeypot and rate limit, no sentence said twice across the docs. No raw date arithmetic, no raw database imports, no dialog opened outside the primitives. `pnpm test` runs them, CI runs them, and Playwright walks every public route in both themes for axe and proves the modal holds open until its work resolves.
- **Docs.** `AGENTS.md` for every agent, `docs/progress.md` for where the build stands, `docs/product/` and `docs/design/` as templates with a prompt per section, `docs/engineering/` for the detail, and a launch list for the day a real person arrives.
- **Migrations.** A committed baseline. `main` migrates, every other branch pushes.

## Versions

Pinned to the set that passed the fresh clone proof. Dependabot opens a PR
when any of them moves.

| Package | Version |
| --- | --- |
| next | 16.3.4 |
| react | 19.2.8 |
| better-auth | 1.7.2 |
| drizzle-orm | 0.45.2 |
| @neondatabase/serverless | 1.1.0 |
| tailwindcss | 4.3.3 |
| shadcn | 4.21.0 |
| geist | 1.7.2 |
| @sentry/nextjs | 10.73.0 |
| typescript | 6.0.3 |
| vitest | 4.1.11 |
| @playwright/test | 1.63.0 |
| pnpm | 12.3.4, through the `packageManager` field |
| Node | 24. The Better Auth CLI needs 22 or later. |

## Keeping it fresh

The template rots at the rate of its dependencies, so the durable parts are
the docs, the tokens and the rules. When a project made from this is a
version behind, run Dependabot's PR on the template first, prove it on a
fresh clone, then bring the project up to it. The `.starter-kit` file in a
project records the template commit it started from.

## Licence

All rights reserved. Readable as evidence of how the author works, not
licensed for reuse.
