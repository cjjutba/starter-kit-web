"use server";

import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { z } from "zod";
import { product } from "@/config";
import { recordPrivacyRequest } from "@/lib/db/privacy-requests";
import { clientIp, rateLimit } from "@/lib/guard/rate-limit";
import { isBot } from "@/lib/guard/honeypot";
import { send } from "@/lib/mail";
import { deletionRequestMail } from "@/lib/mail/templates";

// The public write path, and the pattern every other one follows: honeypot,
// rate limit, validate, then act. A bot gets a quiet success and nothing
// happens. A person over the limit is told when to try again. The request
// is recorded before it is mailed, because the mail log is purged and a
// contact address may not exist yet.

export interface DeletionRequestState {
  ok: boolean;
  error?: string;
  fieldErrors?: { email?: string; message?: string };
}

const schema = z.object({
  email: z.email("Enter the email address you signed up with."),
  message: z.string().max(2000, "Keep the message under 2000 characters.").default(""),
});

export async function requestDeletion(_previous: DeletionRequestState, formData: FormData): Promise<DeletionRequestState> {
  if (isBot(formData)) return { ok: true };

  const limit = await rateLimit("deletion-request", clientIp(await headers()), 3, 60 * 60);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return { ok: false, error: `Too many requests from this address. Try again in ${minutes} minutes.` };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return { ok: false, fieldErrors: { email: flat.email?.[0], message: flat.message?.[0] } };
  }

  await recordPrivacyRequest(parsed.data);
  if (product.contactEmail) {
    // The request is recorded, which is what the person asked for. A mail
    // failure here is ours to fix, not theirs to retry, so it is reported
    // and the person still hears that it worked.
    try {
      await send(deletionRequestMail({ to: product.contactEmail, ...parsed.data }));
    } catch (error) {
      Sentry.captureException(error);
    }
  }
  return { ok: true };
}
