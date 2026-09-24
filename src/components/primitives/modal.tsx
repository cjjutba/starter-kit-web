"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill } from "./pill";

// The only way to open a modal. DESIGN.md: a modal that asks a question owns
// the work it starts. The confirm pill spins in place, the modal stays open
// while the server is working, and it closes only after the promise resolves.
// A failure keeps the modal open and puts the reason inside it, next to the
// button that caused it, because a modal that closes on failure throws the
// person back to a screen that looks unchanged and tells them nothing.
//
// This is a primitive rather than a pattern in prose because eslint stops
// anything outside src/components/primitives from importing the dialog
// directly. There is no second way to do it, so there is no wrong way.

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Rendered in the footer, before the confirm pill. */
  footer?: ReactNode;
  /**
   * Work is in flight. Takes the close button away, because it cannot close
   * anything while the work runs and a control that looks live and does
   * nothing is worse than no control.
   */
  busy?: boolean;
}

export function Modal({ open, onOpenChange, title, description, children, footer, busy }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!busy}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /** The label on the pill that does the thing. Say the verb, not "OK". */
  confirmLabel: string;
  /** Shown beside the spinner while the promise is in flight. */
  pendingLabel?: string;
  cancelLabel?: string;
  /** Red pill for anything that destroys or cannot be undone. */
  destructive?: boolean;
  /**
   * The work. Resolve and the modal closes. Throw, or return a string, and
   * the modal stays open and shows it. Awaited, so the spinner is honest.
   */
  onConfirm: () => Promise<string | void>;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  pendingLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmModalProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const failure = await onConfirm();
      if (failure) {
        setError(failure);
        return;
      }
      onOpenChange(false);
    } catch {
      setError("That did not go through. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  // While the work is in flight the modal ignores the overlay, escape and the
  // close button, so a half finished action cannot be dismissed into silence.
  function requestChange(next: boolean) {
    if (pending) return;
    if (!next) setError(null);
    onOpenChange(next);
  }

  return (
    <Modal
      open={open}
      onOpenChange={requestChange}
      busy={pending}
      title={title}
      description={description}
      footer={
        <>
          <Pill variant="text" size="sm" onClick={() => requestChange(false)} disabled={pending}>
            {cancelLabel}
          </Pill>
          <Pill
            variant={destructive ? "danger" : "primary"}
            size="sm"
            onClick={confirm}
            loading={pending}
            loadingLabel={pendingLabel ?? confirmLabel}
          >
            {confirmLabel}
          </Pill>
        </>
      }
    >
      {children}
      {error ? (
        <p role="alert" className="text-label text-error">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
