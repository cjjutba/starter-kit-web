"use client";

import { ErrorNotice } from "@/components/error-notice";
import { Card } from "@/components/primitives/surfaces";

// Inside the shell, so an error in one page leaves the sidebar in place.

export default function AppErrorPage(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card as="section" role="alert" className="flex flex-col gap-4 p-5">
      <ErrorNotice {...props} />
    </Card>
  );
}
