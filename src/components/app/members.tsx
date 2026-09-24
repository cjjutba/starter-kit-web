"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Outcome } from "@/components/forms/outcome";
import { controlClass, InputField } from "@/components/primitives/field";
import { ConfirmModal } from "@/components/primitives/modal";
import { Pill } from "@/components/primitives/pill";
import { Row } from "@/components/primitives/surfaces";
import { isOwner, roleLabel, roleOptions } from "@/lib/auth/roles";
import {
  cancelInvitation,
  deleteOrganisation,
  leaveOrganisation,
  removeMember,
  updateMemberRole,
  type OrganisationFormState,
} from "@/app/app/settings/actions";
import { appCopy } from "@/content/app";

// The people list and the two doors out. Anything that takes access away
// asks in a modal that owns its work: the pill spins, the modal holds, and
// a refusal from the server is shown inside it rather than swallowed.

const initial: OrganisationFormState = {};

export interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function MemberRow({
  member,
  isSelf,
  canManage,
  viewerIsOwner,
}: {
  member: MemberItem;
  isSelf: boolean;
  canManage: boolean;
  viewerIsOwner: boolean;
}) {
  const [state, action, pending] = useActionState(updateMemberRole, initial);
  const [open, setOpen] = useState(false);
  // An admin cannot touch an owner. Better Auth refuses it, so the controls
  // are not shown either.
  const editable = canManage && !isSelf && (viewerIsOwner || !isOwner(member.role));
  const roles = roleOptions(viewerIsOwner);

  return (
    <div className="flex flex-col gap-2">
      <Row
        tone="field"
        title={member.name}
        secondary={isSelf ? `${member.email}, you` : member.email}
        trailing={
          editable ? (
            <div className="flex flex-wrap items-center gap-2">
              <form action={action} className="flex items-center gap-2">
                <input type="hidden" name="memberId" value={member.id} />
                <select
                  // Keyed on the saved role so a change does not snap back after the action.
                  key={member.role}
                  name="role"
                  defaultValue={member.role}
                  aria-label={`Role for ${member.name}`}
                  // The row is field toned, so the control steps back to the sheet.
                  className={controlClass("page", false, "h-touch w-auto appearance-none pr-8 text-small")}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <Pill type="submit" variant="secondary" size="xs" loading={pending} loadingLabel="Saving">
                  Save role
                </Pill>
              </form>
              <Pill variant="danger" size="xs" onClick={() => setOpen(true)}>
                Remove
              </Pill>
            </div>
          ) : (
            <span className="text-label text-text-2">{roleLabel(member.role)}</span>
          )
        }
      />
      <Outcome state={state} />
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Remove ${member.name}?`}
        description={appCopy.organisation.removeConfirm}
        confirmLabel="Remove"
        pendingLabel="Removing"
        destructive
        onConfirm={async () => {
          const result = await removeMember(member.id);
          return result.error;
        }}
      />
    </div>
  );
}

export function InvitationRow({ invitation, canManage }: { invitation: { id: string; email: string; role: string | null }; canManage: boolean }) {
  const [state, action, pending] = useActionState(cancelInvitation, initial);
  return (
    <div className="flex flex-col gap-2">
      <Row
        tone="field"
        title={invitation.email}
        secondary={`Invited as ${roleLabel(invitation.role).toLowerCase()}, not yet accepted`}
        trailing={
          canManage ? (
            <form action={action}>
              <input type="hidden" name="invitationId" value={invitation.id} />
              <Pill type="submit" variant="secondary" size="xs" loading={pending} loadingLabel="Cancelling">
                Cancel invitation
              </Pill>
            </form>
          ) : (
            <span className="text-label text-text-2">{roleLabel(invitation.role)}</span>
          )
        }
      />
      <Outcome state={state} />
    </div>
  );
}

export function LeaveOrganisation({ name }: { name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pill variant="danger" size="sm" className="h-auto min-h-10 whitespace-normal py-2" onClick={() => setOpen(true)}>
        Leave {name}
      </Pill>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Leave ${name}?`}
        description={appCopy.organisation.leaveConfirm}
        confirmLabel="Leave"
        pendingLabel="Leaving"
        destructive
        onConfirm={async () => {
          const result = await leaveOrganisation();
          if (result.error) return result.error;
          router.push("/app");
          router.refresh();
        }}
      />
    </>
  );
}

export function DeleteOrganisation({ name }: { name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  function change(next: boolean) {
    setOpen(next);
    if (!next) setTyped("");
  }
  return (
    <>
      <Pill variant="danger" size="sm" className="h-auto min-h-10 whitespace-normal py-2" onClick={() => setOpen(true)}>
        Delete {name}
      </Pill>
      <ConfirmModal
        open={open}
        onOpenChange={change}
        title={`Delete ${name}?`}
        description={appCopy.organisation.deleteConfirm}
        confirmLabel="Delete organisation"
        pendingLabel="Deleting"
        destructive
        onConfirm={async () => {
          if (typed.trim() !== name) return "Type the organisation's name exactly to confirm.";
          const result = await deleteOrganisation();
          if (result.error) return result.error;
          router.push("/app");
          router.refresh();
        }}
      >
        <InputField label={`Type ${name} to confirm`} value={typed} onChange={(event) => setTyped(event.target.value)} autoComplete="off" />
      </ConfirmModal>
    </>
  );
}
