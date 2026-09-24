"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { authClient } from "@/lib/auth/client";

// Two forms in one file because they are two halves of one flow. Without a
// token, ask for the email and always say the same thing afterwards, so the
// form cannot be used to check whether an address has an account. With a
// token, take the new password.

export function ResetForm({ token }: { token: string | null }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    await authClient.requestPasswordReset({ email: String(form.get("email") ?? ""), redirectTo: "/reset" });
    setPending(false);
    setDone(true);
  }

  async function setPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const result = await authClient.resetPassword({ newPassword: String(form.get("password") ?? ""), token: token ?? "" });
    if (result.error) {
      setError(result.error.message ?? "That link has expired. Ask for a new one.");
      setPending(false);
      return;
    }
    setPending(false);
    setDone(true);
  }

  if (done) {
    return (
      <Card tone="field" className="flex flex-col gap-4 p-5" role="status">
        <p className="text-body">
          {token
            ? "Your password is changed."
            : `If that address has an account, a reset link is on its way.${process.env.NODE_ENV === "production" ? "" : " In development it is in the mail log."}`}
        </p>
        <div>
          <Pill asChild size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Pill>
        </div>
      </Card>
    );
  }

  if (token) {
    return (
      <form onSubmit={setPassword} className="flex flex-col gap-5">
        <InputField
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          helper="At least 10 characters."
          error={error ?? undefined}
        />
        <Pill type="submit" block loading={pending} loadingLabel="Saving">
          Set the new password
        </Pill>
      </form>
    );
  }

  return (
    <form onSubmit={requestLink} className="flex flex-col gap-5">
      <InputField label="Email" name="email" type="email" autoComplete="email" required />
      <Pill type="submit" block loading={pending} loadingLabel="Sending">
        Send a reset link
      </Pill>
      <p className="text-small text-text-2">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-text">
          Sign in
        </Link>
      </p>
    </form>
  );
}
