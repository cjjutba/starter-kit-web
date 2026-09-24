# Mail

One entry point, two providers, one log.

`send()` in `src/lib/mail/index.ts` is the only way a message leaves.
`log` writes the message to `mail_log` and sends nothing. `resend` sends
through Resend and then logs. Both return the log id. Resend needs
`MAIL_PROVIDER=resend` and `VERCEL_ENV=production` together, so a preview
or a laptop with a copied env file stays on the log whatever it sets.
Production on the log warns once per instance, because nobody new can
verify an address until mail is real.

Templates in `src/lib/mail/templates.ts` are plain functions that return
`{ to, subject, text, html }`. Text first. The html is the same words in a
light wrapper, every value escaped, because names and messages come from
strangers.

Better Auth calls `send()` for verification links, password resets,
invitations, the approval before an address changes, and the note to an
address someone else tried to sign up with.
The privacy form calls it for deletion requests. New messages go through
the same function.

To read what was sent locally, `pnpm mail:log` prints the last five rows,
or `pnpm mail:log 20` for more. The verify skill uses it.

`/api/jobs/purge` deletes mail older than thirty days and abuse counters
older than a day. `vercel.ts` runs it daily and Vercel sends `CRON_SECRET`
as a bearer token.
