import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import {
  anyUserExists,
  clearActiveOrganisation,
  createPersonalOrganisation,
  deleteOrganisationsOnlyMemberOf,
  organisationForMember,
  organisationsOnlyOwnedBy,
  pendingInvitationFor,
} from "@/lib/auth/organisations";

// The helpers requireOrganisation() and the invite-only gate lean on, run
// against an in-process Postgres. The session's active organisation is a
// hint, so the join is what decides, and a removed member has to come back
// as not a member rather than as the organisation they were removed from.

const client = new PGlite();
const db = drizzle({ client, schema });

const now = new Date();
const orgA = { id: "org-a", name: "Acme Studio", slug: "acme", createdAt: now };
const orgB = { id: "org-b", name: "Northwind Traders", slug: "northwind", createdAt: now };
const ana = { id: "user-a", name: "Ana", email: "ana@example.com", createdAt: now, updatedAt: now };
const ben = { id: "user-b", name: "Ben", email: "ben@example.com", createdAt: now, updatedAt: now };

beforeAll(async () => {
  const { apply } = await pushSchema(schema, db as unknown as Parameters<typeof pushSchema>[1]);
  await apply();
});

afterAll(async () => {
  await client.close();
});

describe("membership", () => {
  it("reports no users on an empty database, so the first account is let in", async () => {
    expect(await anyUserExists(db)).toBe(false);
    await db.insert(schema.user).values(ana);
    expect(await anyUserExists(db)).toBe(true);
  });

  it("returns the organisation with the role for a member, and null otherwise", async () => {
    await db.insert(schema.organization).values([orgA, orgB]);
    await db.insert(schema.member).values({ id: "m-a", organizationId: orgA.id, userId: ana.id, role: "admin", createdAt: now });

    const current = await organisationForMember(ana.id, orgA.id, db);
    expect(current).toMatchObject({ id: orgA.id, name: orgA.name, role: "admin" });
    expect(await organisationForMember(ana.id, orgB.id, db)).toBeNull();
    expect(await organisationForMember(ana.id, "no-such-organisation", db)).toBeNull();
  });

  it("forgets an organisation on the sessions that had it active", async () => {
    const later = new Date(now.getTime() + 60_000);
    await db.insert(schema.session).values([
      { id: "s-1", token: "t-1", userId: ana.id, expiresAt: later, createdAt: now, updatedAt: now, activeOrganizationId: orgA.id },
      { id: "s-2", token: "t-2", userId: ana.id, expiresAt: later, createdAt: now, updatedAt: now, activeOrganizationId: orgB.id },
    ]);

    await clearActiveOrganisation(ana.id, orgA.id, db);
    const rows = await db.select().from(schema.session).where(eq(schema.session.userId, ana.id));
    expect(rows.find((row) => row.id === "s-1")?.activeOrganizationId).toBeNull();
    expect(rows.find((row) => row.id === "s-2")?.activeOrganizationId).toBe(orgB.id);

    await clearActiveOrganisation(null, orgB.id, db);
    const after = await db.select().from(schema.session).where(eq(schema.session.id, "s-2"));
    expect(after[0].activeOrganizationId).toBeNull();
  });

  it("finds a pending, unexpired invitation for an address in any case", async () => {
    const later = new Date(now.getTime() + 60_000);
    const earlier = new Date(now.getTime() - 60_000);
    await db.insert(schema.invitation).values([
      { id: "i-1", organizationId: orgB.id, email: "Ben@Example.com", role: "member", status: "pending", expiresAt: later, inviterId: ana.id },
      { id: "i-2", organizationId: orgB.id, email: "old@example.com", role: "member", status: "pending", expiresAt: earlier, inviterId: ana.id },
      { id: "i-3", organizationId: orgB.id, email: "gone@example.com", role: "member", status: "canceled", expiresAt: later, inviterId: ana.id },
    ]);

    expect(await pendingInvitationFor("ben@example.com", db)).toBe(true);
    expect(await pendingInvitationFor(" BEN@example.com ", db)).toBe(true);
    expect(await pendingInvitationFor("old@example.com", db)).toBe(false);
    expect(await pendingInvitationFor("gone@example.com", db)).toBe(false);
    expect(await pendingInvitationFor("nobody@example.com", db)).toBe(false);
  });

  it("names the organisations a person is the only owner of while others belong", async () => {
    await db.insert(schema.user).values(ben);
    // Ana owns Acme with Ben as a member: deletion would strand Ben.
    await db.update(schema.member).set({ role: "owner" }).where(eq(schema.member.id, "m-a"));
    await db.insert(schema.member).values({ id: "m-b", organizationId: orgA.id, userId: ben.id, role: "member", createdAt: now });

    expect(await organisationsOnlyOwnedBy(ana.id, db)).toEqual([orgA.name]);
    expect(await organisationsOnlyOwnedBy(ben.id, db)).toEqual([]);

    // A second owner clears it.
    await db.update(schema.member).set({ role: "owner" }).where(eq(schema.member.id, "m-b"));
    expect(await organisationsOnlyOwnedBy(ana.id, db)).toEqual([]);
  });

  it("deletes only the organisations a person is alone in", async () => {
    const personal = { id: "org-p", name: "Ana", slug: "ana-personal", createdAt: now };
    await db.insert(schema.organization).values(personal);
    await db.insert(schema.member).values({ id: "m-p", organizationId: personal.id, userId: ana.id, role: "owner", createdAt: now });

    expect(await deleteOrganisationsOnlyMemberOf(ana.id, db)).toBe(1);
    const left = await db.select({ id: schema.organization.id }).from(schema.organization);
    expect(left.map((row) => row.id).sort()).toEqual([orgA.id, orgB.id]);
  });
});

describe("personal organisation", () => {
  it("creates one with its owner in a single statement, and never a second", async () => {
    const cy = { id: "user-c", name: "Cy Renée", email: "cy@example.com", createdAt: now, updatedAt: now };
    await db.insert(schema.user).values(cy);

    const first = await createPersonalOrganisation(cy, db);
    const owned = await organisationForMember(cy.id, first, db);
    expect(owned).toMatchObject({ name: "Cy Renée", role: "owner" });
    expect(owned?.slug).toMatch(/^cy-renee-[0-9a-f]{8}$/);

    expect(await createPersonalOrganisation(cy, db), "a person who already belongs somewhere keeps it").toBe(first);
    const memberships = await db.select().from(schema.member).where(eq(schema.member.userId, cy.id));
    expect(memberships).toHaveLength(1);
  });
});
