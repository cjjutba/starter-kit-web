"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ConfirmModal } from "@/components/primitives/modal";
import { Pill } from "@/components/primitives/pill";
import { Card, Row } from "@/components/primitives/surfaces";

// The two parts of the design sheet that need state. Everything else on the
// sheet renders on the server.

// One modal that resolves and one that comes back with a reason, both on a
// deliberate delay so the in flight state is real. tests/e2e/modal.spec.ts
// drives them.
export function ModalDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  return (
    <>
      <Card className="flex flex-wrap items-center gap-3 p-6">
        <Pill size="sm" onClick={() => setConfirmOpen(true)}>
          Confirm that succeeds
        </Pill>
        <Pill size="sm" variant="danger" onClick={() => setFailOpen(true)}>
          Confirm that fails
        </Pill>
      </Card>
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Send the invitation?"
        description="They get an email with a link that expires in seven days."
        confirmLabel="Send invitation"
        pendingLabel="Sending"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }}
      />
      <ConfirmModal
        open={failOpen}
        onOpenChange={setFailOpen}
        title="Delete this note?"
        description="This cannot be undone."
        confirmLabel="Delete note"
        pendingLabel="Deleting"
        destructive
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          return "The note was already deleted by someone else.";
        }}
      />
    </>
  );
}

/** Rows that can be tapped, which is what a list of records looks like. */
export function RowDemo() {
  const chevron = <ChevronRight className="size-5 text-text-2" strokeWidth={1.5} />;
  return (
    <div className="flex flex-col gap-2">
      <Row tone="field" title="Acme Studio" secondary="Owner" trailing={chevron} onClick={() => {}} />
      <Row tone="field" title="Northwind Traders" secondary="Member" trailing={chevron} onClick={() => {}} />
    </div>
  );
}
