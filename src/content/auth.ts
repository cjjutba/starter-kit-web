// The sign in, sign up and invitation copy. Anything longer than a sentence,
// or shown on more than one screen, lives here rather than in the markup.

const inDevelopment = process.env.NODE_ENV !== "production";

export const authCopy = {
  signIn: {
    expiredLink: "That verification link has expired or was already used. Sign in and a fresh one is sent.",
  },
  signUp: {
    open: "You get a personal space straight away. Invite people to it, or accept an invitation to theirs.",
    invited: "This product is by invitation. Use the address your invitation was sent to, and it opens here once you confirm it.",
  },
  checkEmail: {
    unverifiedTitle: "Verify your address first",
    unverified: (address: string) => `A fresh link is on its way to ${address}. Open it and you are signed in. It stops working after an hour.`,
    sentTitle: "Check your email",
    sent: (address: string) =>
      `A link to confirm ${address} is on its way. It stops working after an hour.${inDevelopment ? " With MAIL_PROVIDER=log it is in the mail log, not an inbox." : ""}`,
  },
  reset: {
    sent: `If that address has an account, a reset link is on its way.${inDevelopment ? " In development it is in the mail log." : ""}`,
  },
  invite: {
    signedOut: {
      title: "You have an invitation",
      lead: "Sign in with the address it was sent to, or create an account with that address, and it opens here.",
    },
    closed: {
      title: "This invitation is not open",
      lead: "It may have expired, been withdrawn, or been sent to a different email address than the one you signed in with.",
    },
  },
};
