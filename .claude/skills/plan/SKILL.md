---
name: plan
description: Fills the product docs in order, in conversation, and ends with a feature list where every feature has a "done means" line and a review depth. Use before building feature one, or when docs/product/brief.md is still a template. Refuses to start a feature until the docs exist.
---

# plan

The step agents skip. A feature built without a brief is a feature nobody
asked for. This runs before `/feature F1`. The docs have no word limit,
and compact is still the rule: `docs/README.md` says how.

Apply the `unslop` skill to every line written. No dashes as punctuation.

## Before writing

Read `docs/product/intake.md` first, then `src/config.ts`, `AGENTS.md`,
`docs/product/decisions.md` and any doc already written. Setup settled the
product's shape, the flags and the design knobs. The intake holds the brief
and every answer given so far.

Then go through the order below and, for each file, list what the intake
settles and what it leaves open. Ask about the open ones in rounds of three
to five questions. Restate what is settled as a table, so the person
corrects rather than repeats. Never fill a gap with a default. **End the
turn.** Writing starts when the person says the answers are complete,
not before. Each answer goes into the intake as it is given.

## Order

1. `docs/product/brief.md`
2. `docs/product/users.md`
3. `docs/product/scope.md`
4. `docs/product/roadmap.md`, because what scope leaves out of v1 is what the roadmap holds
5. `docs/product/glossary.md`
6. `docs/product/features.md`
7. `docs/product/data-model.md`
8. `docs/product/roles.md`
9. `docs/product/privacy.md`, and `src/content/privacy.ts` to match
10. `docs/design/pages.md`, and `src/content/routes.ts` to match
11. `docs/design/screens.md`, because the workflow designs the screen before it breaks into features
12. `docs/design/direction.md`, if the product changes the template's taste. The four knobs, accent, ground, shape and typeface, follow "Making it yours" in `DESIGN.md`, and the tests decide whether the result holds.

One file at a time. Read the file. It has a purpose line at the top and a
prompt under each heading. Write each section from the intake and the
answers. A section the intake still cannot fill is a question, asked in
conversation, not a default. Read the whole file back and cut anything
another doc already says. Link to it instead.

## Rules

- Ask about what is missing. Do not ask what the repo or the intake already says. Restate it and let the person correct it.
- Every feature in `features.md` gets a "done means" line a stranger could check, and a review depth from `docs/workflow.md`. Mark the checkpoint after which the product goes in front of a real person, and say that `docs/engineering/launch.md` runs there.
- Every choice that closes a door is the person's. Ask, then record their answer in `docs/product/decisions.md` as a dated entry with the alternatives. An answer the agent supplied is not a decision, and "defaulted, easy to change" is not one either.
- The glossary decides names. Once a term is in it, code uses that word.
- If the person wants to skip a doc, say which decisions that leaves open and let them choose. Do not silently skip.

## Ends when

Every file in the order is written, the feature list has
its "done means" lines, every feature is in the table in
`docs/progress.md` as planned with Next set to `/feature F1`, `routes.ts`
matches `pages.md`, and `pnpm test` is green. Say so, list the features with their depth, and stop. `/feature F1`
is the person's to type after they have read the docs.
