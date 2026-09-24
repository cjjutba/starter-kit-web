import { product } from "../../config";
import type { Mail } from "./index";

// Plain functions that return a message. Text first, html as a light
// wrapper around the same words, so a client that strips html loses nothing.
// Organisation names, inviter names and the deletion form's message are
// typed by strangers, so every value is escaped before it becomes html.

function escape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function html(title: string, paragraphs: string[]): string {
  const body = paragraphs.map((p) => `<p style="margin:0 0 16px">${escape(p)}</p>`).join("");
  return `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;max-width:560px;margin:0 auto;padding:24px"><h1 style="font-size:20px;font-weight:500;margin:0 0 24px">${escape(title)}</h1>${body}</div>`;
}

export function resetPasswordMail({ to, name, url }: { to: string; name: string; url: string }): Mail {
  const title = `Reset your ${product.name} password`;
  const lines = [
    `Hi ${name || "there"},`,
    "Someone asked to reset the password for this address. If it was you, open this link:",
    url,
    "If it was not you, ignore this message. The link stops working after an hour.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}

export function invitationMail({
  to,
  inviterName,
  organisationName,
  url,
}: {
  to: string;
  inviterName: string;
  organisationName: string;
  url: string;
}): Mail {
  const title = `${inviterName} invited you to ${organisationName}`;
  const lines = [
    `${inviterName} has invited you to join ${organisationName} on ${product.name}.`,
    "Open this link to accept:",
    url,
    "If you were not expecting this, ignore it and nothing happens.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}

export function deletionRequestMail({ to, email, message }: { to: string; email: string; message: string }): Mail {
  const title = `Deletion request from ${email}`;
  const lines = [
    `${email} asked for their data to be deleted.`,
    "Their message:",
    message || "(none)",
    "The request is recorded. pnpm privacy:requests lists what is open.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}

export function verifyEmailMail({ to, name, url }: { to: string; name: string; url: string }): Mail {
  const title = `Confirm your ${product.name} address`;
  const lines = [
    `Hi ${name || "there"},`,
    "Open this link to confirm this address is yours. It signs you in as well:",
    url,
    "The link stops working after an hour. If you did not ask for this, ignore it and nothing happens.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}

export function existingAccountMail({ to, name }: { to: string; name: string }): Mail {
  const title = `Someone tried to sign up with your ${product.name} address`;
  const lines = [
    `Hi ${name || "there"},`,
    `Someone just tried to create a ${product.name} account with this address, which already has one. If it was you, sign in instead, or reset your password if you have forgotten it.`,
    "If it was not you, nothing has changed and you can ignore this.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}

export function changeEmailConfirmationMail({
  to,
  name,
  newEmail,
  url,
}: {
  to: string;
  name: string;
  newEmail: string;
  url: string;
}): Mail {
  const title = `Approve changing your ${product.name} address`;
  const lines = [
    `Hi ${name || "there"},`,
    `Someone signed in as you asked to change the address on your account to ${newEmail}. If that was you, open this link to approve it. A confirmation then goes to the new address:`,
    url,
    "If it was not you, do not open the link, and change your password.",
  ];
  return { to, subject: title, text: lines.join("\n\n"), html: html(title, lines) };
}
