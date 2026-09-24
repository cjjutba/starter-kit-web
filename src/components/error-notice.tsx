"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Pill } from "@/components/primitives/pill";

// What an error boundary says, wherever it renders. The root boundary puts
// it on a sheet of its own. The one under /app keeps it inside the shell, so
// the sidebar stays and the person can go somewhere else.

export function ErrorNotice({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <>
      <h1 className="text-heading font-medium">Something went wrong</h1>
      <p className="text-body text-text-2">The page hit an error it could not recover from.</p>
      {error.digest ? <p className="text-label text-text-2 tabular">Reference {error.digest}</p> : null}
      <div>
        <Pill onClick={reset}>Try again</Pill>
      </div>
    </>
  );
}
