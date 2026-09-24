# Glossary

One row per concept. The code column is the word used in tables, types and routes, and it does not change once something ships.

| Term | Meaning | In code |
| --- | --- | --- |
| Organisation | The tenant. Every tenant table carries its id. | `organization` table, `organisation_id` column, `forOrganisation()` |
| Member | A person's place in an organisation, with a role. | `member` table |
| Owner, admin, member | The three roles Better Auth gives a member. `roles.md` maps them to what people can do. | `role` column |
| Invitation | A pending place in an organisation, sent by email, accepted by signing in with that address. | `invitation` table, `/invite/[id]` |
| Session | A signed in browser. Carries the active organisation. | `session` table, `activeOrganizationId` |
| Note | The example record. Replace this row with the product's first real entity. | `notes` table |
