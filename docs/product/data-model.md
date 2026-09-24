# Data model

Entities and the rules that hold them together. The schema in `src/lib/db/schema.ts` is the source of truth for columns; this file says why.

## Entities

One short paragraph per entity: what it is, what it belongs to, what it must never be without. Start from the example `notes` table and replace it.

## Relationships

Which entity owns which. Cascades on delete, and where a delete must be refused instead.

## Tenancy

Every tenant table is listed in `src/lib/db/tables.ts` under `tenantTables` and carries `organisation_id`. List them here with one line on why each is tenant owned. Shared tables go under `sharedTables` with one line on why they hold no tenant data.

## Time

Every timestamp is `timestamptz`. The organisation row carries `timezone`. Say which entities have time in them and how each renders.

## What is deliberately not stored

Passwords in the clear, card numbers, health data, anything the product does not need. Say it, so it stays true.
