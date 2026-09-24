"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputField } from "@/components/primitives/field";
import { ConfirmModal } from "@/components/primitives/modal";
import { Pill } from "@/components/primitives/pill";
import { authClient } from "@/lib/auth/client";
import { appCopy } from "@/content/app";

// The one destructive thing on the account page. The modal asks for the
// password, spins in place while the server works, and stays open with the
// reason when the server refuses, which it does for the only owner of an
// organisation other people still belong to.

export function DeleteAccount() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  function change(next: boolean) {
    setOpen(next);
    if (!next) setPassword("");
  }

  return (
    <>
      <div>
        <Pill variant="danger" size="sm" onClick={() => setOpen(true)}>
          Delete my account
        </Pill>
      </div>
      <ConfirmModal
        open={open}
        onOpenChange={change}
        title="Delete your account?"
        description={appCopy.account.deleteConfirm}
        confirmLabel="Delete account"
        pendingLabel="Deleting"
        destructive
        onConfirm={async () => {
          const result = await authClient.deleteUser({ password });
          if (result.error) return result.error.message ?? "That did not go through.";
          router.push("/");
          router.refresh();
        }}
      >
        <InputField
          label="Your password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </ConfirmModal>
    </>
  );
}
