import type { Metadata } from "next";
import { headers } from "next/headers";
import { InvitationRow, MemberRow } from "@/components/app/members";
import { InviteForm } from "@/components/app/organisation-forms";
import { SettingsHeader } from "@/components/app/settings-header";
import { Card } from "@/components/primitives/surfaces";
import { auth } from "@/lib/auth/server";
import { canManage as manages, isOwner } from "@/lib/auth/roles";
import { requireOrganisation } from "@/lib/auth/session";

export const metadata: Metadata = { title: "People" };

// Who belongs to the organisation and who is on the way in. Owners and
// admins invite, change roles and remove. Members read.

export default async function PeoplePage() {
  const { session, organisationId, organisation } = await requireOrganisation();
  const full = await auth.api.getFullOrganization({ query: { organizationId: organisationId }, headers: await headers() });
  const members = full?.members ?? [];
  const pending = (full?.invitations ?? []).filter((invitation) => invitation.status === "pending");
  const viewerIsOwner = isOwner(organisation.role);
  const canManage = manages(organisation.role);

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader segment="people" detail={`${members.length} in ${organisation.name}${pending.length ? `, ${pending.length} invited` : ""}`} />

      {canManage ? (
        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Invite someone</h2>
          <InviteForm canInviteOwner={viewerIsOwner} />
        </Card>
      ) : null}

      <Card as="section" className="flex flex-col gap-4 p-5">
        <h2 className="text-heading font-medium">People</h2>
        {full ? null : <p className="text-body text-text-2">The list of people could not load. Reload the page to try again.</p>}
        <ul className="flex flex-col gap-2">
          {members.map((item) => (
            <li key={item.id}>
              <MemberRow
                member={{ id: item.id, name: item.user.name, email: item.user.email, role: item.role }}
                isSelf={item.userId === session.user.id}
                canManage={canManage}
                viewerIsOwner={viewerIsOwner}
              />
            </li>
          ))}
          {pending.map((invitation) => (
            <li key={invitation.id}>
              <InvitationRow invitation={{ id: invitation.id, email: invitation.email, role: invitation.role }} canManage={canManage} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
