import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { product } from "@/config";
import { deletionRequest, privacyNotice } from "@/content/privacy";
import { formatLongDate } from "@/lib/time";

export const metadata: Metadata = { title: privacyNotice.title };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-prose px-gutter py-12">
      <Link href="/" className="text-small font-medium">
        {product.name}
      </Link>
      <h1 className="mt-6 text-title font-medium">{privacyNotice.title}</h1>
      <p className="mt-2 text-small text-text-2">Updated {formatLongDate(privacyNotice.updated)}</p>
      <p className="mt-6 text-body">{privacyNotice.intro}</p>
      <div className="mt-8 flex flex-col gap-4">
        {privacyNotice.sections.map((section) => (
          <Card key={section.heading} as="section" className="flex flex-col gap-3 p-5">
            <h2 className="text-heading font-medium">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-text-2">
                {paragraph}
              </p>
            ))}
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Pill asChild variant="secondary">
          <Link href="/privacy/request">{deletionRequest.title}</Link>
        </Pill>
      </div>
    </main>
  );
}
