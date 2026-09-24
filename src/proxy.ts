import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// An optimistic redirect and nothing more. It checks that a session cookie
// exists, so a forged cookie gets past it. The real check is requireSession()
// in every page and action under /app. Next 16 runs this on Node.

export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
