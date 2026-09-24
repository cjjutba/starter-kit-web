import Link from "next/link";
import type { ReactNode } from "react";
import { Sheet } from "@/components/primitives/surfaces";
import { product } from "@/config";

// The frame every auth page shares. A sheet on the page, the product name
// above it. A product that wants a photograph behind the sheet adds it here
// and nowhere else.

export function AuthShell({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-auth flex-col justify-center px-gutter py-12">
      <Link href="/" className="mb-6 text-heading font-medium">
        {product.name}
      </Link>
      <Sheet className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-title font-medium">{title}</h1>
          {lead ? <p className="mt-2 text-body text-text-2">{lead}</p> : null}
        </div>
        {children}
      </Sheet>
    </main>
  );
}
