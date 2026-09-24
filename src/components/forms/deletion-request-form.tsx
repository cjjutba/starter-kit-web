"use client";

import { useActionState } from "react";
import { Honeypot } from "@/components/forms/honeypot";
import { InputField, TextareaField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { requestDeletion, type DeletionRequestState } from "@/app/privacy/request/actions";

const initial: DeletionRequestState = { ok: false };

export function DeletionRequestForm() {
  const [state, action, pending] = useActionState(requestDeletion, initial);

  if (state.ok) {
    return (
      <Card tone="sheet" className="p-5" role="status">
        <p className="text-body">Received. The request is logged and someone will confirm by email once it is done.</p>
      </Card>
    );
  }

  return (
    <form action={action} className="relative flex flex-col gap-5">
      <Honeypot />
      <InputField label="Email" name="email" type="email" autoComplete="email" required on="page" error={state.fieldErrors?.email} />
      <TextareaField
        label="Anything we should know"
        name="message"
        hint="Optional"
        on="page"
        placeholder="Which account, or which data"
        error={state.fieldErrors?.message}
      />
      {state.error ? (
        <p role="alert" className="text-small text-error">
          {state.error}
        </p>
      ) : null}
      <div>
        <Pill type="submit" loading={pending} loadingLabel="Sending">
          Send the request
        </Pill>
      </div>
    </form>
  );
}
