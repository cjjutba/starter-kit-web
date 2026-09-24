import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateOrganisationForm } from "@/components/app/organisation-forms";
import { features } from "@/config";
import { requireOrganisation } from "@/lib/auth/session";
import { DEFAULT_TZ } from "@/lib/time";
import { appCopy } from "@/content/app";

export const metadata: Metadata = { title: "New organisation" };

// Only when the product lets people have more than one. Otherwise the
// address does not exist, which is what the flag means.

export default async function NewOrganisationPage() {
  if (!features.multipleOrganisations) notFound();
  const { organisation } = await requireOrganisation();
  return (
    <div className="mx-auto w-full max-w-auth">
      <h1 className="text-title font-medium">New organisation</h1>
      <p className="mt-2 text-body text-text-2">{appCopy.newOrganisation.lead}</p>
      <div className="mt-6">
        <CreateOrganisationForm timezone={organisation.timezone ?? DEFAULT_TZ} timezones={Intl.supportedValuesOf("timeZone")} />
      </div>
    </div>
  );
}
