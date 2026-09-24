import type { Metadata } from "next";
import { EmailForm, NameForm, PasswordForm } from "@/components/app/account-forms";
import { DeleteAccount } from "@/components/app/delete-account";
import { Card } from "@/components/primitives/surfaces";
import { requireSession } from "@/lib/auth/session";
import { appCopy } from "@/content/app";

export const metadata: Metadata = { title: "Account" };

// The person's own settings. Organisation settings are on the organisation
// page, because they belong to everyone in it.

export default async function AccountPage() {
  const { user } = await requireSession();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-title font-medium">Account</h1>
        <p className="mt-1 text-small text-text-2">{user.email}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Name</h2>
          <NameForm name={user.name} />
        </Card>

        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Email</h2>
          <EmailForm email={user.email} />
        </Card>

        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Password</h2>
          <PasswordForm />
        </Card>

        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Delete account</h2>
          <p className="text-small text-text-2">
            {appCopy.account.deleteLead}
          </p>
          <DeleteAccount />
        </Card>
      </div>
    </div>
  );
}
