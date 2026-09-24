// Copy for the screens under /app that is longer than a sentence or shown
// in more than one place.

export const appCopy = {
  notes: {
    emptyLead: "The first one takes a title and whatever is worth remembering.",
  },
  newOrganisation: {
    lead: "You become its owner and it opens straight away. Invite people from its organisation page.",
  },
  account: {
    deleteLead:
      "Removes you and your personal organisation. If you are the only owner of an organisation other people belong to, make someone else an owner first.",
    deleteConfirm:
      "Your personal organisation and everything in it go with it. Notes you wrote in shared organisations stay, without your name. This cannot be undone.",
  },
  organisation: {
    leavingLead: "Leaving takes your access away and keeps what you wrote. Deleting takes everything, for everyone.",
    readOnlyTimezone: (zone: string) => `Times are shown in ${zone}. An owner or admin can change the name and timezone.`,
    removeConfirm: "They lose access to everything in this organisation. What they wrote stays.",
    leaveConfirm: "You lose access to everything in it. If you are its only owner, make someone else an owner first.",
    deleteConfirm: "Everyone loses access and everything in it is gone. This cannot be undone.",
  },
};
