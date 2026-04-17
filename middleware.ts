import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production");
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf-8");
}

function verifyJWT(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64UrlDecode(parts[1]));

    const exp = payload.exp;
    if (exp && Date.now() > exp * 1000) return null;

    const expectedKey = JWT_SECRET;
    const keyBuffer = Buffer.from(expectedKey, "utf-8");

    const signatureInput = `${parts[0]}.${parts[1]}`;
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", keyBuffer)
      .update(signatureInput)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (parts[2] !== expectedSignature) return null;

    return payload;
  } catch {
    return null;
  }
}

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

  return NextResponse.next();
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