import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "ipms_token";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAuthPage = pathname.startsWith("/login");
  const isDashboard = pathname.startsWith("/dashboard");
  const isProtectedApi =
    pathname.startsWith("/api") &&
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/v1/auth");

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && (isDashboard || isProtectedApi)) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/:path*"],
};
