import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createPersonalOrganisation,
  firstOrganisationFor,
  organisationForMember,
  type CurrentOrganisation,
} from "./organisations";
import { auth } from "./server";

// Server side session helpers. The proxy only checks that a cookie exists.
// These are the real checks, and every page and action under /app calls one.

export type { CurrentOrganisation };

/** Read from the database every time, so a revoked session ends on its next request. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/**
 * The session, the organisation id every scoped query runs against, and
 * that organisation's row with the person's role in it. Membership is
 * checked on every call rather than read from the session, because the
 * active id outlives a removal or a deletion on every session but the
 * actor's. When it does not hold, the session is healed to the person's
 * first organisation, or a fresh personal one, and never dead ended.
 */
export async function requireOrganisation() {
  const session = await requireSession();
  const userId = session.user.id;
  const active = session.session.activeOrganizationId ?? null;

  let organisation = active ? await organisationForMember(userId, active) : null;

  if (!organisation) {
    const organisationId = (await firstOrganisationFor(userId)) ?? (await createPersonalOrganisation(session.user));
    // Updates the session row. Setting the cookie fails inside a render and
    // is ignored, which is safe: there is no cookie cache, so the next
    // request reads the session row and finds the healed id.
    await auth.api
      .setActiveOrganization({ body: { organizationId: organisationId }, headers: await headers() })
      .catch(() => undefined);
    organisation = await organisationForMember(userId, organisationId);
    if (!organisation) throw new Error("This person has no organisation and one could not be created.");
  }

  return { session, organisationId: organisation.id, organisation };
}
