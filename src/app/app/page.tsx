import type { Metadata } from "next";
import Link from "next/link";
import { DeleteNote } from "@/components/app/delete-note";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { requireOrganisation } from "@/lib/auth/session";
import { forOrganisation } from "@/lib/db/scoped";
import { formatShortDate } from "@/lib/time";
import { appCopy } from "@/content/app";

export const metadata: Metadata = { title: "Notes" };

// The example feature. One list, one empty state, create, edit with a
// version check, delete in a modal. It proves the scoped layer and the
// shell, and it is the first thing a new product replaces.

export default async function NotesPage() {
  const { organisationId, organisation } = await requireOrganisation();
  const notes = await forOrganisation(organisationId).notes.list();
  const tz = organisation.timezone ?? undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-title font-medium">Notes</h1>
        <Pill asChild size="sm">
          <Link href="/app/notes/new">New note</Link>
        </Pill>
      </div>

      {notes.length === 0 ? (
        <Card className="p-6">
          <p className="text-heading font-medium">No notes yet</p>
          <p className="mt-1 text-body text-text-2">{appCopy.notes.emptyLead}</p>
          <div className="mt-4">
            <Pill asChild variant="secondary" size="sm">
              <Link href="/app/notes/new">Write the first note</Link>
            </Pill>
          </div>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <Card as="li" key={note.id} className="flex flex-col gap-2 p-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-heading font-medium">
                  <Link href={`/app/notes/${note.id}`} className="hover:underline">
                    {note.title}
                  </Link>
                </h2>
                <DeleteNote id={note.id} title={note.title} />
              </div>
              {note.body ? <p className="whitespace-pre-wrap text-body text-text-2">{note.body}</p> : null}
              <p className="text-label text-text-2">
                <span className="tabular">{formatShortDate(note.createdAt, tz)}</span>
                {", "}
                {note.authorName ? `by ${note.authorName}` : "by someone who has left"}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
