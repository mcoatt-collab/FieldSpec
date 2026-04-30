import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signJWT, shouldRefreshJWT, verifyJWT } from "@/lib/auth/jwt";

export const runtime = "nodejs";

const isProtectedRoute = (pathname: string) => pathname.startsWith("/dashboard");
const isAuthRoute = (pathname: string) =>
  pathname === "/login" ||
  pathname === "/signup" ||
  pathname === "/verify-email" ||
  pathname === "/reset-password";

function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("auth_token")?.value || null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = getTokenFromRequest(request);
  const payload = token ? verifyJWT(token) : null;
  const isAuthenticated = payload !== null;

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  const response = NextResponse.next();

  if (payload && shouldRefreshJWT(payload)) {
    const refreshed = signJWT({
      userId: payload.userId,
      email: payload.email,
      tokenVersion: payload.tokenVersion,
    });

    response.cookies.set("auth_token", refreshed.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor((refreshed.expiresAt.getTime() - Date.now()) / 1000),
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/verify-email",
    "/reset-password",
  ],
};
