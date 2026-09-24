---
name: feature
description: Runs the build loop for one feature from docs/product/features.md. Plan the slice, design the screen, build, self check, verify, review code and design at the right depth, fix, screenshot, record, PR, merge, production green. Use for every feature. Takes the feature id, for example "feature F2".
---

# feature

One feature, start to production. The loop is `docs/workflow.md`. This is
the checklist that makes it happen.

Apply the `unslop` skill to commit messages, PR bodies, copy and comments.
Never run `vercel deploy`. The push deploys. Never push the schema to
`main`. It migrates.

## 1. Read

Read the feature's entry in `docs/product/features.md`, its pages in
`docs/design/pages.md`, and the glossary. If the entry has no "done means"
line, stop and run `/plan`. Say the review depth out loud.

## 2. Plan the slice, then stop

Write the plan in three to eight lines: the tables added, the pages added
or changed, the actions, the states. If a table is added, say the tenancy
classification. If the schema changes, say the migration ships first. If
the slice needs a decision the docs do not make, ask it in the same
message. Show the plan. **End the turn.** The build starts when the person
says go, and their answers go in `docs/product/decisions.md` before the
branch is cut. Then branch: `git switch -c feature/<id>-<slug>`, and in
`docs/progress.md` set Now to the feature and its branch and its status
to building.

## 3. Design the screen

Read `docs/design/screens.md`. If the feature adds or changes a screen,
decide whether it needs a board before code. A screen the paying person
sees every day gets one through `/image`. A settings page is designed
against running code. Write the screen's row either way, so the order
screens get designed in is recorded rather than remembered.

## 4. Build

Follow `docs/engineering/conventions.md`. A new table goes through the
steps in `docs/engineering/data.md`. A new public write path copies the
pattern in `src/app/privacy/request/actions.ts`. A destructive action asks
through `ConfirmModal`. Copy longer than a sentence goes in `src/content/`.
A new route goes in `src/content/routes.ts` and `docs/design/pages.md`
in the same commit, or the routes test goes red.

**Retire the example.** F1 lands the product's first real entity. In the
same PR, delete the notes: the routes under `src/app/app/notes`, the block
in `scoped.ts`, the table and its `tenantTables` entry, the nav link, the
glossary row, the routes and pages rows, the F0 notes steps in the verify
skill, and the states rows. Generate the migration that drops the table.
A product that ships with a Notes tab is a product nobody finished.

## 5. Self check

`pnpm lint`, `pnpm typecheck`, `pnpm test`. Start the dev server in the
browser preview and click what was built. Then the five states from
`docs/design/states.md`: empty, loading, error, full, overflowing. Fix what
fails.

## 6. Verify

Add the feature's steps to `.claude/skills/verify/SKILL.md` under a heading
with the feature id. Run `/verify`. It has to pass end to end before review.

## 7. Review

Code, then design, at the depth the feature names.

Deep: the `interrogate` skill, or `/code-review` at high effort, looking for
tenancy leaks, permission holes, abuse paths and edge cases. Then the
`interface-design:design-review` skill on every changed screen. Normal:
`/code-review` at the default, then the `impeccable` skill on the changed
screens. Fix what either finds. Push back with evidence on what they get
wrong.

## 8. Record

A screenshot of each changed screen into `docs/design/screenshots/` as
`<date>-<page>.png`, taken from the local run. A dated entry in
`docs/product/decisions.md` for anything decided. A row in
`docs/design/states.md` for each new screen.

## 9. Ship

Commit in small steps with reasons in the body. Push. `gh pr create` with
the template filled in. Wait for CI green and the preview to build. If a
migration ships, run `pnpm db:migrate` against `main` first, as
`docs/engineering/deploy.md` says. Merge. Watch the production deployment
until it is ready.

## 10. Close

In `docs/progress.md`, mark the feature shipped, clear Now, set Next, and
clear any resume note it made stale. Update
`docs/product/metrics.md` if a number changed. If this was the checkpoint
feature, run `docs/engineering/launch.md` top to bottom before a real
person is sent to the product. Say what is next.
