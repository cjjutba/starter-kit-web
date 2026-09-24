# Conventions

How code is written here. Anything a lint can check is in
`eslint.config.mjs` or `tests/rules/` instead of this file.

## Files

Kebab case. One component per file, named after it. A route folder holds
`page.tsx`, and `actions.ts` beside it when the page mutates. Forms are
client components under `src/components/<area>/`, never inside a page file.

## Server and client

Server Components by default. `"use client"` only on the leaf that needs
state or an event handler. A page reads with `requireOrganisation()` and the
scoped layer, then hands data down as props.

## Mutations

Every server action follows the same shape, and `src/app/app/notes/actions.ts`
is the reference. `"use server"`. Require the session or organisation first.
Parse the form with zod. Call the scoped layer or a Better Auth API. Revalidate
the path. Return a state object for the form, never throw for an expected
failure. Forms use `useActionState` and show `fieldErrors` next to the field
and `error` above the button.

## Imports

`@/` inside `src/app`, `src/components` and `src/content`. Relative inside
`src/lib/db` and `src/lib/auth`, because the Better Auth CLI loads those
without the alias. The raw database handle and date-fns have restricted
import rules, and eslint says where.

## Spelling

British in prose and in identifiers: organisation, colour, licence. Except
where a library owns the name. Better Auth's tables are `organization`,
`member` and `invitation`, and its fields are `organizationId` and
`activeOrganizationId`. The boundary is the schema file. Our own column is
`organisation_id`.

## Copy

Static copy is typed data in `src/content/`, not markup in a component.
Sentence case. `docs/design/copy.md` has the voice.

## Formatting

eslint through the Next config, no Prettier. Match the surrounding file.
Double quotes, semicolons, trailing commas, two spaces.

## Commits

One change per commit. The subject says what changed and the body says why,
in sentences. No dashes as punctuation. No semicolons. The reasoning has to
survive a year.
