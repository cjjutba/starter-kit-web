import { product } from "@/config";

// A starting notice, written for a product that collects a name and an email
// address from people in the Philippines, where RA 10173 applies. It is not
// legal advice. Edit it before launch and keep `updated` honest. It has to
// agree with docs/product/privacy.md.

export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

// How long a request takes, said on the notice and on the request page.
const answeredWithin = "fifteen working days";

/** The deletion request page and the link to it from the notice. */
export const deletionRequest = {
  title: "Ask for your data to be deleted",
  lead: `Tell us the email address on the account. Deletion is confirmed by email and finished within ${answeredWithin}.`,
};

const rights = product.contactEmail
  ? `Use the deletion request form or write to ${product.contactEmail}.`
  : "Use the deletion request form.";

export const privacyNotice = {
  title: "Privacy notice",
  updated: "2026-09-09",
  intro: `${product.name} collects the minimum it needs to run and keeps it only as long as it is useful to you.`,
  sections: [
    {
      heading: "What is collected",
      paragraphs: [
        "Your name and email address when you create an account, and the password you choose, which is stored as a hash and never readable by anyone.",
        "Whatever you write inside the product. It belongs to the organisation you wrote it in.",
        "The address your requests come from, kept briefly to stop abuse of public forms and of sign in.",
      ],
    },
    {
      heading: "How it is used",
      paragraphs: [
        "To sign you in, to show you your organisation's data, and to send the messages the product has to send, such as a link to confirm your address, a password reset or an invitation. Nothing is used for advertising and nothing is sold.",
      ],
    },
    {
      heading: "How long it is kept",
      paragraphs: [
        "Account data stays until you delete your account from its settings page, or ask for it to be removed. Sent messages are logged for thirty days and then purged. Abuse counters last a day. A deletion request is kept for a year as the record that it was made and handled.",
      ],
    },
    {
      heading: "Who can see it",
      paragraphs: [
        "The people in your organisation, according to their role. The team that runs the product, when needed to keep it running. Nobody else.",
        "Four services help run it, each under its own notice. Neon holds the database. Vercel serves the pages and counts visits without cookies or a profile. Resend delivers the mail. Sentry receives error reports, which are set up to carry no personal data.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Under the Data Privacy Act of 2012 you can ask what is held about you, ask for it to be corrected, or ask for it to be deleted. ${rights} Requests are answered within ${answeredWithin}.`,
      ],
    },
  ] satisfies PrivacySection[],
};
