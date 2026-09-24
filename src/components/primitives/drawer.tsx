"use client";

import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

// The one overlay besides Modal. DESIGN.md: a panel that slides in from the
// left on a phone and holds the sidebar. It asks nothing and starts no work,
// so unlike a modal it closes on a tap outside, on Escape, and on any link
// inside it, because a tap on a link is a navigation.

export function Drawer({
  open,
  onOpenChange,
  title,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Read by screen readers only. */
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        aria-describedby={undefined}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) onOpenChange(false);
        }}
        className={className}
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  );
}
