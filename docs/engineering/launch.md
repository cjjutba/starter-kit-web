# Launch

The list a product runs once, at the checkpoint feature,
before a real person is sent to it. Setup leaves every item here on
purpose, because each needs something only the product has.

## Before the first real person

1. **Domain.** Add it in Vercel. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to it, in production only. Sessions on the old address end.
2. **Mail.** A Resend key, a verified sender in `MAIL_FROM`, `MAIL_PROVIDER=resend` in production. Until then every confirmation link sits in the mail log and nobody new can sign in.
3. **Contact address.** `NEXT_PUBLIC_CONTACT_EMAIL` in production. The privacy page publishes it and deletion requests are mailed to it as well as recorded.
4. **Error reports.** A Sentry project and its DSN in production. The org, project and token in CI if readable stack traces are wanted.
5. **The privacy notice.** `src/content/privacy.ts` and `docs/product/privacy.md` agree, name only the processors still in use, cite the law where the users are, and `updated` is today.
6. **The content security policy.** Decide, and record it in `decisions.md`. The kit ships frame ancestors only, and `next.config.ts` says why.
7. **Neon.** Know the history window on the free tier and what a restore takes before it is needed.
8. **One real sign up on production**, end to end: the confirmation arrives in a real inbox, sign in works, an invitation arrives and is accepted.
9. **`docs/product/metrics.md`** filled in for the day.

## The first week

Watch Sentry. Run `pnpm privacy:requests` against `main`. Read what the
first person says before building anything else.
