"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Outcome } from "@/components/forms/outcome";
import { controlClass, InputField } from "@/components/primitives/field";
import { ConfirmModal } from "@/components/primitives/modal";
import { Pill } from "@/components/primitives/pill";
import { Row } from "@/components/primitives/surfaces";
import {
  cancelInvitation,
  deleteOrganisation,
  leaveOrganisation,
  removeMember,
  updateMemberRole,
  type OrganisationFormState,
} from "@/app/app/settings/actions";

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

function isOwner(role: string): boolean {
  return role.split(",").includes("owner");
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
  const roles = [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
    ...(viewerIsOwner ? [{ value: "owner", label: "Owner" }] : []),
  ];

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
                  className={controlClass("page", false, "h-10 w-auto appearance-none pr-8 text-small")}
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
            <span className="text-label text-text-2">{member.role}</span>
          )
        }
      />
      <Outcome state={state} />
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Remove ${member.name}?`}
        description="They lose access to everything in this organisation. What they wrote stays."
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
        secondary={`Invited as ${invitation.role ?? "member"}, not yet accepted`}
        trailing={
          canManage ? (
            <form action={action}>
              <input type="hidden" name="invitationId" value={invitation.id} />
              <Pill type="submit" variant="secondary" size="xs" loading={pending} loadingLabel="Cancelling">
                Cancel invitation
              </Pill>
            </form>
          ) : (
            <span className="text-label text-text-2">{invitation.role ?? "member"}</span>
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
      <Pill variant="danger" size="sm" onClick={() => setOpen(true)}>
        Leave {name}
      </Pill>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Leave ${name}?`}
        description="You lose access to everything in it. If you are its only owner, make someone else an owner first."
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
      <Pill variant="danger" size="sm" onClick={() => setOpen(true)}>
        Delete {name}
      </Pill>
      <ConfirmModal
        open={open}
        onOpenChange={change}
        title={`Delete ${name}?`}
        description="Everyone loses access and everything in it is gone. This cannot be undone."
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
