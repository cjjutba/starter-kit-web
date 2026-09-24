# Specs

One file per feature, `F<n>-<slug>.md`, written by `/feature` in its plan
step and shown to the person before anything is built. The build follows
the spec. When the build learns something the spec did not say, the spec
changes in the same commit, so it stays true after the feature ships.

`product/features.md` says what each feature is and what done means. The
spec says how. Copy the block below, keep every heading, and write "None"
under one that does not apply rather than deleting it. A rule test checks
the headings.

```markdown
# F<n> Name

## Goal

One or two sentences: what exists when this is done. The "done means" line
from features.md, made concrete.

## Design

The screens added or changed, whether each gets a board first, and which
primitives and tokens it uses. Anything new that DESIGN.md does not cover.

## Implementation

One subsection per boundary it crosses: route, server action, component,
job, mail. Each says what to build, precisely enough that there is no
guessing.

## Data and tenancy

Tables added or changed, their classification in `tables.ts`, the block in
`scoped.ts`, and the migration order from `engineering/data.md`. "None" if
the schema does not change.

## Dependencies

Packages it adds, each with the reason. A package is added in the feature
that first needs it, not earlier.

## Verify when done

- [ ] The "done means" line, checked by hand
- [ ] Empty, loading, error, full and overflowing, per `design/states.md`
- [ ] Its steps added to the verify skill, and `/verify` passes
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` are green

## Review depth

Deep or normal, from features.md, and what the review looks at hardest.
```
