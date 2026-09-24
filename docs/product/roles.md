# Roles

One block per role, mapped to the Better Auth roles owner, admin and member. Say what each can do in verbs.

## Owner

Everything, including deleting the organisation and changing who pays.

## Admin

Everything except that. Invites and removes people, changes settings.

## Member

The daily work. Say exactly which records they can create, edit and delete.

## The outside

What a person with no account can do. Usually one public form, always guarded.

## How this is enforced

Better Auth checks organisation roles in its own endpoints, and refuses to remove, demote or let leave the only owner with the codes `YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER` and `YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER`, which the actions turn into a sentence. `requireOrganisation()` returns the member's role, and a server action checks it before calling the scoped layer when a product needs more than Better Auth's own rules.
