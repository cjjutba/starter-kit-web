// Better Auth's organisation roles, read the same way everywhere. A member
// row can carry more than one, as "owner,admin", so every check splits it.
// Better Auth enforces what each role may do. These only decide what a page
// shows and how a role reads.

/** Whether the role string includes this role. */
export function hasRole(role: string, wanted: string): boolean {
  return role.split(",").some((part) => part.trim() === wanted);
}

export function isOwner(role: string): boolean {
  return hasRole(role, "owner");
}

/** Owners and admins manage people and details. */
export function canManage(role: string): boolean {
  return isOwner(role) || hasRole(role, "admin");
}

/** "owner,admin" reads as "Owner", the first and strongest role. */
export function roleLabel(role: string | null | undefined): string {
  const first = role?.split(",")[0]?.trim() || "member";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/** The roles a person may hand out. Only an owner makes another owner. */
export function roleOptions(viewerIsOwner: boolean): { value: string; label: string }[] {
  return [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
    ...(viewerIsOwner ? [{ value: "owner", label: "Owner" }] : []),
  ];
}
