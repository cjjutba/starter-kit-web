# States

Every screen passes this list before it is done. Generated mockups never show these, which is why real products fail at them.

## The five

**Empty.** Nothing yet. Name what is missing, say how the first one arrives, give the action.

**Loading.** Including the Neon cold start, which is real and needs a skeleton rather than a spinner. A button that starts work spins in place. Work asked for in a modal holds the modal open until it resolves.

**Error.** The save failed. The record changed under you. The network went away.

**Full.** Every slot taken. A success for the business, a dead end for the person, so it needs a next step, not an apology.

**Overflowing.** Sixteen rows where you expected three, names that wrap, a missing optional field, a record with no owner.

## The test

Design against the worst realistic day, not the tidiest one.

## Per screen

Add a row when a screen ships. `src/app/app/loading.tsx` is the skeleton for every app screen.

| Screen | Empty | Error | Full | Overflowing |
| --- | --- | --- | --- | --- |
| Notes | Card names what is missing, with the action | Delete refused: the modal says why | No limit | Titles wrap, a gone author is said |
| Edit note | Not found for a missing or foreign note | Changed under you: one line, reload | No limit | Body scrolls in the field |
| Settings | Just you, no invitations | Refusal inside the modal or under the form | Better Auth's member limit message | Rows stack on a phone |
| Account | Never | Refusal inside the modal, field errors under fields | Never | Long addresses wrap |
| Sign up, sign in | Never | One line under the field. Unverified: a card with a resend | Never | Never |
