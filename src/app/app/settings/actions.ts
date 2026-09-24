"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/forms/outcome";
import { features } from "@/config";
import { auth } from "@/lib/auth/server";
import { requireOrganisation } from "@/lib/auth/session";
import { firstErrors, idSchema } from "@/lib/forms";
import { mailProvider } from "@/lib/mail";
import { uniqueSlug } from "@/lib/slug";

// Every action here checks the session and hands the rest to Better Auth,
// which enforces the roles: admins and owners manage people, only an owner
// deletes the organisation or promotes to owner, and nobody can remove,
// demote or walk out as the only owner. Its refusals come back as codes and
// are turned into a sentence here.

export type OrganisationFormState = FormState;

const roles = ["member", "admin", "owner"] as const;

function explain(error: unknown, fallback: string): string {
  const code = (error as { body?: { code?: string } }).body?.code ?? "";
  if (code.includes("ONLY_OWNER") || code.includes("WITHOUT_AN_OWNER")) {
    return "Make someone else an owner first.";
  }
  return error instanceof Error ? error.message : fallback;
}

const detailsSchema = z.object({
  name: z.string().trim().min(1, "Give the organisation a name.").max(80, "Keep the name under 80 characters."),
  timezone: z.string().refine((value) => Intl.supportedValuesOf("timeZone").includes(value), "Pick a timezone from the list."),
});

export async function updateOrganisation(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  const { organisationId } = await requireOrganisation();
  const parsed = detailsSchema.safeParse({ name: formData.get("name"), timezone: formData.get("timezone") });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await auth.api.updateOrganization({
      body: { organizationId: organisationId, data: parsed.data },
      headers: await headers(),
    });
  } catch (error) {
    return { error: explain(error, "The organisation could not be updated.") };
  }
  revalidatePath("/app", "layout");
  return { ok: true, message: "Saved." };
}

const inviteSchema = z.object({
  email: z.email("Enter an email address."),
  role: z.enum(roles),
});

export async function inviteMember(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  const { organisationId } = await requireOrganisation();
  const parsed = inviteSchema.safeParse({ email: formData.get("email"), role: formData.get("role") ?? "member" });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await auth.api.createInvitation({
      body: { email: parsed.data.email, role: parsed.data.role, organizationId: organisationId, resend: true },
      headers: await headers(),
    });
  } catch (error) {
    return { error: explain(error, "The invitation could not be sent.") };
  }
  revalidatePath("/app/settings/people");
  const where = mailProvider() === "log" ? " It is in the mail log, not an inbox, until mail is switched on." : "";
  return { ok: true, message: `Invitation sent to ${parsed.data.email}.${where}` };
}

const roleSchema = z.object({
  memberId: z.string().min(1),
  role: z.enum(roles),
});

export async function updateMemberRole(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  const { organisationId } = await requireOrganisation();
  const parsed = roleSchema.safeParse({ memberId: formData.get("memberId"), role: formData.get("role") });
  if (!parsed.success) return { error: "Pick a role." };
  try {
    await auth.api.updateMemberRole({
      body: { memberId: parsed.data.memberId, role: parsed.data.role, organizationId: organisationId },
      headers: await headers(),
    });
  } catch (error) {
    return { error: explain(error, "The role could not be changed.") };
  }
  revalidatePath("/app/settings/people");
  return { ok: true, message: "Role changed." };
}

export async function removeMember(memberId: string): Promise<{ error?: string }> {
  const { organisationId } = await requireOrganisation();
  const parsed = idSchema.safeParse(memberId);
  if (!parsed.success) return { error: "Reload the page and try again." };
  try {
    await auth.api.removeMember({
      body: { memberIdOrEmail: parsed.data, organizationId: organisationId },
      headers: await headers(),
    });
  } catch (error) {
    return { error: explain(error, "That person could not be removed.") };
  }
  revalidatePath("/app/settings/people");
  return {};
}

export async function cancelInvitation(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  await requireOrganisation();
  const parsed = idSchema.safeParse(formData.get("invitationId"));
  if (!parsed.success) return { error: "Reload the page and try again." };
  try {
    await auth.api.cancelInvitation({ body: { invitationId: parsed.data }, headers: await headers() });
  } catch (error) {
    return { error: explain(error, "The invitation could not be cancelled.") };
  }
  revalidatePath("/app/settings/people");
  return { ok: true };
}

export async function leaveOrganisation(): Promise<{ error?: string }> {
  const { organisationId } = await requireOrganisation();
  try {
    await auth.api.leaveOrganization({ body: { organizationId: organisationId }, headers: await headers() });
  } catch (error) {
    return { error: explain(error, "You could not leave.") };
  }
  revalidatePath("/app", "layout");
  return {};
}

export async function deleteOrganisation(): Promise<{ error?: string }> {
  const { organisationId } = await requireOrganisation();
  try {
    await auth.api.deleteOrganization({ body: { organizationId: organisationId }, headers: await headers() });
  } catch (error) {
    return { error: explain(error, "The organisation could not be deleted.") };
  }
  revalidatePath("/app", "layout");
  return {};
}

export async function createOrganisation(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  await requireOrganisation();
  if (!features.multipleOrganisations) return { error: "This product has one organisation per person." };
  const parsed = detailsSchema.safeParse({ name: formData.get("name"), timezone: formData.get("timezone") });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  const slug = uniqueSlug(parsed.data.name, "organisation");
  let created: { id: string } | null = null;
  try {
    created = await auth.api.createOrganization({
      body: { name: parsed.data.name, slug, timezone: parsed.data.timezone },
      headers: await headers(),
    });
    if (created) {
      await auth.api.setActiveOrganization({ body: { organizationId: created.id }, headers: await headers() });
    }
  } catch (error) {
    return { error: explain(error, "The organisation could not be created.") };
  }
  revalidatePath("/app", "layout");
  redirect("/app");
}
