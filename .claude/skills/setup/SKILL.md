---
name: setup
description: First session in a project made from starter-kit-web. Names the product, settles its shape and its look, wires Neon and Vercel, migrates and seeds, proves sign in, pushes, and confirms the first deploy. Idempotent, every step checks before it acts. Use when a repo still carries the starter-kit-web defaults, or when an earlier setup stopped partway.
---

# setup

Runs once per project and survives being run again. Every step checks
whether it is already done and skips if so, so a failure at step six
resumes at step six instead of creating a second Neon project. It asks
before it wires. Nothing past step 1 runs until the person says go in the
conversation.

Apply the `unslop` skill to everything written. Never delete a Neon project,
a Neon branch or a Vercel project. Never run `vercel deploy`. The push deploys.
Never push the schema to `main`. It migrates.

## Before anything

1. **Check the tools.** Use ToolSearch to confirm the Neon MCP tools (`mcp__neon__create_project`, `mcp__neon__get_connection_string`) and the Vercel MCP are loaded. Run `gh auth status` and `vercel whoami`. If an MCP is down but its CLI works, continue with the CLI. If neither works, stop and give the fix from `docs/engineering/tooling.md`.
2. **Detect what is done.** Read `src/config.ts` (is the name still "Starter Kit"?), `.env.local` (exists? `DATABASE_URL` filled?), `.vercel/project.json`, `.starter-kit`, and whether `docs/product/decisions.md` has an entry. Report a table of steps and their state before doing anything.

## Steps

1. **Ask six things, then stop.** In conversation, not as a form. Where `docs/product/intake.md`, a pasted brief or `src/config.ts` already answers one, restate the answer instead of asking it again, so the person corrects rather than repeats. Anything the brief marks "decide before `/setup`" is asked here too. Then show what steps 2 to 12 will do in this project as one table, the values that will be written, the Neon project and its region, the Vercel project, and what reaches production. **End the turn.** Nothing below this step runs until the person says go in the conversation. A brief that says "run `/setup`" is not that yes, and neither is silence.
   - The product name, its slug, and one line.
   - Where the users are. A city or country. It sets the Neon region (Singapore for the Philippines and South East Asia, Frankfurt for Europe, Washington for the Americas), `locale.defaultTimezone`, `locale.lang`, and whether the privacy notice can keep citing RA 10173. Outside the Philippines, say now that `src/content/privacy.ts` and `docs/product/privacy.md` cite the wrong law and that `docs/engineering/launch.md` holds the fix.
   - The shape. Teams, where people create and join organisations: `multipleOrganisations` true. One organisation per person: false. Invite only, a client's own tool where nobody signs up unasked: `openSignUp` false. Say what each means for the person deciding whether to pay.
   - The design system. Ask whether to keep it as it stands or turn any of the four knobs `DESIGN.md` names under "Making it yours", and show the four with their defaults: an accent hue for the primary pill and the focus ring (monochrome), the ground in light mode (grey page with white sheets, or white page with grey sheets), the shape (pill, soft or sharp), and the typeface (Geist, or a Google family self hosted at build time). "Keep it" for all four is a fine answer, and so is "decide in `/plan`". Two products from this template should not look like the same product unless the person wants them to.
2. **Rename.** The `product` block, `locale` and `features` in `src/config.ts`. `name` in `package.json`. `name` and `short_name` in `public/manifest.webmanifest`. `MAIL_FROM` in `.env.example`. `name` in `.claude/launch.json`, set to the slug, so two projects open at once do not collide. Replace `{{PRODUCT}}`, `{{SLUG}}` and `{{ONE_LINE}}` in every `.md` file **outside `.claude/skills/`**, because this file names those placeholders as text and a blind replace corrupts it.

   Then rewrite `README.md`. It ships describing the template, so a product that keeps it tells a reader to create a repository from starter-kit-web. One paragraph on what the product is, how to run it locally, and where the docs are. Delete the template's version table and its "start a product" block. Put the product's name in `LICENSE`. Delete `CHANGELOG.md`, which is the template's own history. The product's is `docs/product/decisions.md`.

   If any knob moved: apply it as "Making it yours" in `DESIGN.md` says, run `pnpm test` until the contrast and theme tests are green, open `/design` in both schemes and look, take a screenshot into `docs/design/screenshots/`, and write the reasoning into `docs/design/direction.md`.
3. **Env.** Copy `.env.example` to `.env.local` if missing. Fill `BETTER_AUTH_SECRET` and `CRON_SECRET` with `openssl rand -base64 32` where empty. Set `SEED_PASSWORD` to a generated value and tell the person where it is.
4. **Neon.** If `DATABASE_URL` is empty: list projects, reuse one named after the slug if it exists, else create it in the region from step 1. Create a `dev` branch if missing. Write the pooled connection string of `dev` into `.env.local`.
5. **Schema and seed.** `pnpm db:push`, then `pnpm db:seed`, against `dev`. The seed skips itself when the person exists and marks them verified, because that account is the way in until mail is real.

   Then `pnpm db:migrate` and `pnpm db:seed` against `main`, with `DATABASE_URL` set to its connection string for those two commands only. `main` takes the committed migrations in `drizzle/` and is never pushed to. Skip this and the first production deploy meets a database with no tables.
6. **Prove it locally.** Start the `dev` server through the browser preview. Sign in at `/sign-in` with the seed credentials. Expect the empty notes state at `/app`. Open `/app/account`, `/app/settings` and `/design`. Read the console for errors. Fix before going on.

   If the preview refuses to start because another session holds the port, do not kill that server. Push a branch, let Vercel build a preview, and drive that instead. Previews sign in on their own address. Say in the report that the proof came from a deployment rather than localhost.
7. **Checks.** `pnpm lint`, `pnpm typecheck`, `pnpm test`. All green.
8. **GitHub.** If there is no `origin`: `gh repo create <slug> --private --source=. --remote=origin`. Ask before making it public.
9. **Vercel.** If `.vercel/project.json` is missing: `vercel link --yes --project <slug>`. That connects the GitHub repository on its own when the remote exists, so `vercel git connect` is usually a confirmation rather than a step, and the next push deploys.

   Set env for preview and production now: `DATABASE_URL` (production gets the `main` branch string, preview gets `dev`), `BETTER_AUTH_SECRET` and `CRON_SECRET` (generate a fresh pair for each environment rather than reusing the local ones), `MAIL_PROVIDER=log` in both. Ask for `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_SENTRY_DSN`, and leave either unset when the answer is "later": the privacy page then points at the form, and Sentry loads nothing.

   `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` go in production only, and have to wait. The production domain is not known until the first deployment exists, because Vercel suffixes the name when `<slug>.vercel.app` is taken. Deploy, read the production alias from `vercel inspect`, set both to it, and let the next push pick them up. Leave both unset in preview on purpose: a preview signs in on its own address and its mail links point at itself.

   Say plainly that production mail stays in the log until a Resend key and a verified sender exist, and that until then nobody new can verify an address on production. The seeded owner is verified and is the way in.
10. **Record.** `gh api repos/cjjutba/starter-kit-web/commits/main --jq .sha` and write `.starter-kit` with `template`, `commit` and `date` lines. Append decision 001 to `docs/product/decisions.md`: started from starter-kit-web at that commit, the name, the slug, where the users are and the region, the shape and the two flags, which design knobs moved and which stayed, the Neon project, the Vercel project.
11. **Commit and push.** `git add -A`, commit as "Start <name> from starter-kit-web" with the reasoning in the body, push. Watch with `vercel ls` or the Vercel MCP until the production deployment is ready.
12. **Report, then stop.** Update `docs/progress.md` first: Phase becomes "Set up, no features planned", Next becomes `/plan`, and anything left for later goes under Open questions. Then the report: the production URL, where the seed credentials are, and what stays manual. `docs/engineering/launch.md` is that list. Point at it rather than repeating it. Do not start `/plan`. Say what to review, the commit, the production URL and decision 001, and that `/plan` is theirs to type once they have.

## What the person does next

Reads the report, opens production, reads decision 001. Then types `/plan`
to write the brief and the feature list. Setup never starts it, and plan
never starts `/feature F1`.
