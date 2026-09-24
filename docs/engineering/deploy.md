# Deploy

A push deploys. Nothing else does.

## How it flows

A branch pushed to GitHub builds a preview on Vercel. A pull request carries
the checklist and CI runs lint, typecheck, tests, build and axe. When both
are green and the review is done, the merge to `main` builds production.
The feature ends when that deployment is ready.

Never run `vercel deploy` by hand. It makes a deployment nobody can trace
to a commit, and the push would build a second one anyway.

## First time

`/setup` links the Vercel project, connects it to the GitHub repo with
`vercel git connect`, and sets the environment variables for preview and
production. Without the git connection the push deploys nothing.

## Migrations

Before merging a PR that ships a migration, run `pnpm db:migrate` with
`DATABASE_URL` pointing at the production branch. `data.md` has the order.
The code that needs the change merges after the migration is applied,
never before. Setup applies the baseline the same way before the first
deploy, and `main` is never pushed to.

## Crons

`vercel.ts` declares them. Vercel calls the route with `CRON_SECRET` as a
bearer token. The free plan allows daily schedules. A new job is a route
under `src/app/api/jobs/`, the same secret check, and one line in
`vercel.ts`.

## Rollback

`vercel rollback` or the dashboard promotes the previous production
deployment. It does not roll back a migration, which is why migrations are
additive first and destructive later.

## Domains

Add the domain in the Vercel project, then set `BETTER_AUTH_URL` and
`NEXT_PUBLIC_APP_URL` to it in production. Auth cookies are bound to the
origin, so sessions from the old URL end. `launch.md` is the rest of the
list a product runs before its first real person.
