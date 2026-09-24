# Auth

Better Auth as configured here, and the hooks that keep
tenancy true.

## Files

The instance is `src/lib/auth/server.ts`, `nextCookies` last. The
membership helpers are `organisations.ts`, each taking the database so
PGlite proves them. The real checks are `session.ts`. `src/proxy.ts` is an optimistic redirect on cookie presence.

## The hooks

**Sign up creates a personal organisation.** Nobody is ever without one,
so every query can be scoped.

**Every session starts active in the first membership.**

**Membership is checked, not assumed.** `requireOrganisation()` joins the
active id on `member` every call. Better Auth clears the active id only on
the actor's session, so a removed member or the members of a deleted
organisation would keep a dead id. A miss heals to the first membership
or a new personal one.

## Verification

No session until the address is verified. Sign up sends the link. The link signs the person in and lands on `/sign-in`, which
forwards to `next`. An unverified sign in is refused and a fresh link sent.
An existing address gets the same success, and its owner is told by mail.

## Invite only

`features.openSignUp` false means sign up needs a pending invitation for
the address. The first account on an empty database is always allowed,
which is how the seed and a fresh product get their owner.

## Previews

`baseURL` is a host list: the production host from `BETTER_AUTH_URL`,
`*.vercel.app` and localhost. Add a custom preview domain to the list.

## Rate limiting

Better Auth's limiter counts in memory per instance, so it is routed
through the Postgres counter in `src/lib/guard/`.

## Account

`/app/account`: name, password with every other session signed out, email
approved from the current address then confirmed from the new one, and
deletion behind the password. Deletion is refused for the only owner of
an organisation others belong to, and removes organisations only that
person was in.

## Not built, and the trigger

Sessions list: a person asks. Two factor: a paying customer holding money.
Social sign in: staff who cannot manage a password.

## Flows

Reset always says the same thing. Invitations last a week, need a
verified person whose email matches, and re-inviting cancels the old one.

## Sessions

Read from the database on every request, no cookie cache, so a session
revoked by a password change or a deletion ends on its next request. One
indexed read, which the membership check needs anyway.

Regenerating the schema after a config change is in `data.md`.
