# Testing

Three layers, each with a job.

## Rules, in `tests/rules/`

The rules from `AGENTS.md` and `DESIGN.md` that a test can check. They run
on every `pnpm test`. Add one when an instruction gets
written twice. Each fails on:

- `no-dashes`: an en or em dash, or a hyphen standing in for one.
- `no-raw-colors`: a hex value in a component.
- `no-raw-values`: a component measuring itself with an arbitrary value or an inline style.
- `tenancy`, `scoped-coverage`: a table unclassified, without `organisation_id`, or absent from `forOrganisation()`.
- `contrast`: a token pair under its AA line in either scheme.
- `theme`: config or manifest colours drifting from the page token.
- `env`: a variable the code reads that `.env.example` does not list.
- `routes`: a page, the route directory and `pages.md` disagreeing.
- `guards`: an app action without the session check, a public action without honeypot and rate limit, a server action outside an `actions.ts`, a job without `CRON_SECRET`.
- `references`: a design reference missing its source, date, sections or index row.
- `progress`: `docs/progress.md` missing a section, or listing a feature `features.md` does not define.
- `specs`: a spec missing a heading or a feature, or a feature being built with no spec.
- `no-repeats`: a sentence, or a close paraphrase, written in two docs or skills.
- `skills`: a skill folder the README or `AGENTS.md` does not name, or a doc that counts the skills in words.

CI also fails a pull request whose commit messages carry a dash.

## Unit, in `tests/unit/`

Against PGlite, an in-process Postgres, so they run in CI with no
database: the scoped layer with two organisations that must never see
each other, the membership helpers, privacy requests and the purges, and
the rate limiter. Plus the time helpers, the class merger and
`safeNext`. A helper that touches the database takes it as a parameter so
these can pass one in.

## End to end, in `tests/e2e/`

Once per machine: `pnpm exec playwright install chromium`. axe with the WCAG 2A and 2AA tags on every public route from
`src/content/routes.ts` in light and dark, the security headers, and the
modal holding open until its work resolves. Playwright starts the
production build or points at `E2E_BASE_URL`.

## What is not automated

Signing in, creating a record, sending an invitation. The `verify` skill
drives those the way a person does, and each feature adds its steps. It
runs before every review.
