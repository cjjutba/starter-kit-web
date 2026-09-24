"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import type { FormState } from "@/components/forms/outcome";
import { auth } from "@/lib/auth/server";
import { requireSession } from "@/lib/auth/session";
import { firstErrors } from "@/lib/forms";
import { mailProvider } from "@/lib/mail";

// The account belongs to the person, not the organisation, so these check
// the session and call Better Auth. Deleting the account is a client call
// inside a modal, because it needs the password and signs the person out.

export type AccountFormState = FormState & {
  /** The name as saved. The session cookie that carries the name is refreshed in this same response, so the page cannot read it yet. */
  name?: string;
};

function failed(error: unknown, fallback: string): AccountFormState {
  return { error: error instanceof Error ? error.message : fallback };
}

const nameSchema = z.object({
  name: z.string().trim().min(1, "Give yourself a name.").max(80, "Keep the name under 80 characters."),
});

export async function updateName(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  await requireSession();
  const parsed = nameSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await auth.api.updateUser({ body: { name: parsed.data.name }, headers: await headers() });
  } catch (error) {
    return failed(error, "The name could not be saved.");
  }
  revalidatePath("/app", "layout");
  return { ok: true, message: "Saved.", name: parsed.data.name };
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().min(10, "At least 10 characters.").max(128, "Keep it under 128 characters."),
});

export async function changePassword(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  await requireSession();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  try {
    await auth.api.changePassword({
      body: { ...parsed.data, revokeOtherSessions: true },
      headers: await headers(),
    });
  } catch (error) {
    return failed(error, "The password could not be changed.");
  }
  return { ok: true, message: "Password changed. Every other session is signed out." };
}

const emailSchema = z.object({
  newEmail: z.email("Enter an email address."),
});

export async function changeEmail(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const { user } = await requireSession();
  const parsed = emailSchema.safeParse({ newEmail: formData.get("newEmail") });
  if (!parsed.success) {
    return { fieldErrors: firstErrors(parsed.error) };
  }
  if (parsed.data.newEmail.toLowerCase() === user.email.toLowerCase()) {
    return { fieldErrors: { newEmail: "That is already your address." } };
  }
  try {
    await auth.api.changeEmail({
      body: { newEmail: parsed.data.newEmail, callbackURL: "/app/account" },
      headers: await headers(),
    });
  } catch (error) {
    return failed(error, "The address could not be changed.");
  }
  return {
    ok: true,
    message: `Two mails are on their way. Approve the change from ${user.email}, then confirm ${parsed.data.newEmail}.${mailProvider() === "log" ? " Both are in the mail log until mail is switched on." : ""}`,
  };
}
