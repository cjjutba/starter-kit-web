"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { authCopy } from "@/content/auth";
import { authClient } from "@/lib/auth/client";
import { CheckEmail } from "./check-email";

// Sign up never signs in. The address has to be verified first, so a
// success here is a card that says where the link went. The verification
// link signs the person in and lands on the sign in page, which sees the
// session and sends them on to next. An existing address gets the same card,
// so the form cannot be used to find out who has an account.

export function SignUpForm({ next }: { next: string }) {
  const callbackURL = `/sign-in?next=${encodeURIComponent(next)}`;
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const result = await authClient.signUp.email({
      name: String(form.get("name") ?? "").trim(),
      email,
      password: String(form.get("password") ?? ""),
      callbackURL,
    });
    setPending(false);
    if (result.error) {
      // An uninvited address on an invite only product gets the server's
      // sentence here. An existing address gets the card below, on purpose.
      setError(result.error.message ?? "That did not work. Check the details and try again.");
      return;
    }
    setSent(email);
  }

  if (sent) {
    return <CheckEmail email={sent} callbackURL={callbackURL} title={authCopy.checkEmail.sentTitle} body={authCopy.checkEmail.sent(sent)} />;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <InputField label="Name" name="name" autoComplete="name" required />
      <InputField label="Email" name="email" type="email" autoComplete="email" required error={error ?? undefined} />
      <InputField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
        helper="At least 10 characters."
      />
      <Pill type="submit" block loading={pending} loadingLabel="Creating your account">
        Create account
      </Pill>
      <p className="text-small text-text-2">
        Already have one?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-medium text-text">
          Sign in
        </Link>
      </p>
    </form>
  );
}
