import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// Lightweight, edge-safe gate: presence of the session cookie only.
// Role checks (super-admin-only pages) and full cryptographic verification of
// the session happen server-side in layouts/route handlers via
// `getCurrentUser()`, since that needs Node crypto + the JSON admin store,
// neither of which are appropriate to run in Proxy.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
