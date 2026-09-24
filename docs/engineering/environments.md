# Environments

Three environments, one env file each.

| Variable | Local | Preview | Production |
| --- | --- | --- | --- |
| `DATABASE_URL` | Neon `dev` branch | Neon `dev` or a branch per preview | Neon `main` |
| `BETTER_AUTH_SECRET` | any | its own | its own |
| `BETTER_AUTH_URL` | `http://localhost:3000` | unset, matched from the request | the real domain |
| `NEXT_PUBLIC_APP_URL` | same as above | unset, the branch address | same |
| `NEXT_PUBLIC_CONTACT_EMAIL` | any | real | real |
| `MAIL_PROVIDER` | `log` | `log` | `resend`, once the key exists |
| `MAIL_FROM` | any | any | a verified sender |
| `RESEND_API_KEY` | empty | empty | set |
| `CRON_SECRET` | any | its own | its own |
| `NEXT_PUBLIC_SENTRY_DSN` | empty | empty | set, once a product wants error reports |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | empty | empty | CI only, for source maps |
| `SEED_EMAIL`, `SEED_PASSWORD`, `SEED_NAME` | set | unused | unused |

Local reads `.env.local`, which is never committed. Preview and production
read the Vercel project, set through `vercel env add` or the dashboard, and
`vercel env pull` copies them down when needed.

Secrets are generated with `openssl rand -base64 32` and never reused
between environments.

`.env.example` is the list of everything, with a comment each, and it is
the one env file that is committed. When a variable is added, it goes there
first.
