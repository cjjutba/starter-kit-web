import { Resend } from "resend";
import { db } from "../db/client";
import { mailLog } from "../db/schema";

// One entry point for every message the app sends. "log" writes the message
// to mail_log and sends nothing. "resend" sends and then logs. Resend needs
// MAIL_PROVIDER=resend and a production deployment both, so a preview or a
// laptop with a copied env file sends nothing (AGENTS.md rule 5). Nothing
// else in the codebase knows how mail leaves.

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export type MailProvider = "log" | "resend";

export interface MailResult {
  provider: MailProvider;
  logId: string;
  providerId: string | null;
}

let warned = false;

export function mailProvider(): MailProvider {
  const production = process.env.VERCEL_ENV === "production";
  if (production && process.env.MAIL_PROVIDER === "resend") return "resend";
  // Production on the log is allowed, because setup ships it that way until a
  // Resend key exists. It still means nobody new can verify an address, so
  // say so once per instance where the logs will show it.
  if (production && !warned) {
    warned = true;
    console.warn("Mail is going to the log in production. Nobody new can verify an address until MAIL_PROVIDER=resend. See docs/engineering/launch.md.");
  }
  return "log";
}

export async function send(mail: Mail): Promise<MailResult> {
  const provider = mailProvider();
  let providerId: string | null = null;

  if (provider === "resend") {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("MAIL_PROVIDER is resend but RESEND_API_KEY is not set.");
    }
    const from = process.env.MAIL_FROM;
    if (!from) {
      throw new Error("MAIL_PROVIDER is resend but MAIL_FROM is not set.");
    }
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      throw new Error(`Resend refused the message: ${error.message}`);
    }
    providerId = data?.id ?? null;
  }

  const [row] = await db
    .insert(mailLog)
    .values({
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html ?? null,
      provider,
      providerId,
    })
    .returning({ id: mailLog.id });

  return { provider, logId: row.id, providerId };
}
