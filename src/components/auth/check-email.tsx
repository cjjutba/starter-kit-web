"use client";

import { useState } from "react";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { authClient } from "@/lib/auth/client";

// The card that says where a verification link went, with a way to send it
// again. Sign up shows it after every attempt, and sign in shows it when the
// address is not verified yet, because Better Auth sends a fresh link then.

export function CheckEmail({
  email,
  callbackURL,
  title,
  body,
  onBack,
}: {
  email: string;
  callbackURL: string;
  title: string;
  body: string;
  /** Offers a way back to the form when given. */
  onBack?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [resent, setResent] = useState(false);

  async function resend() {
    setPending(true);
    await authClient.sendVerificationEmail({ email, callbackURL });
    setPending(false);
    setResent(true);
  }

  return (
    <Card tone="field" className="flex flex-col gap-4 p-5" role="status">
      <p className="text-heading font-medium">{title}</p>
      <p className="text-body text-text-2">{body}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Pill variant="secondary" size="sm" onClick={resend} loading={pending} loadingLabel="Sending">
          Send it again
        </Pill>
        {onBack ? (
          <Pill variant="text" size="sm" onClick={onBack}>
            Back
          </Pill>
        ) : null}
        {resent ? <span className="text-small text-text-2">Sent.</span> : null}
      </div>
    </Card>
  );
}
