import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE as ADMIN_COOKIE, isValidSessionToken as isValidAdminToken } from "@/lib/admin/session";
import { SESSION_COOKIE as BROTHER_COOKIE, isValidSessionToken as isValidBrotherToken } from "@/lib/brother/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Speed Dating tier: any brother with the shared code, or an admin, can in.
  // Kept separate from the admin block below since it's a different cookie
  // and a lower bar to clear (rank-and-file brothers, not just officers).
  if (
    pathname.startsWith("/speed-dating") ||
    pathname.startsWith("/api/speed-dating") ||
    pathname.startsWith("/api/brother")
  ) {
    if (pathname === "/speed-dating/login" || pathname === "/api/brother/session-status") {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
    const brotherToken = request.cookies.get(BROTHER_COOKIE)?.value;
    if (isValidAdminToken(adminToken) || isValidBrotherToken(brotherToken)) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/speed-dating/login", request.url));
  }

  if (pathname === "/admin/login" || pathname === "/api/admin/session-status") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (isValidAdminToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/speed-dating/:path*",
    "/api/speed-dating/:path*",
    "/api/brother/:path*",
  ],
};
