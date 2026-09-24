"use client";

import { ErrorNotice } from "@/components/error-notice";
import { Sheet } from "@/components/primitives/surfaces";

export default function ErrorPage(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-auth flex-col justify-center px-gutter py-12">
      <Sheet className="space-y-4 p-6">
        <ErrorNotice {...props} />
      </Sheet>
    </main>
  );
}
