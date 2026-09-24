import * as Sentry from "@sentry/nextjs";

// The browser side. Errors only, no session replay, no traces, no personal
// data. Off entirely while the DSN is empty.

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  // The server and edge configs name the environment too, so one Sentry
  // project tells a preview's errors from production's.
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
