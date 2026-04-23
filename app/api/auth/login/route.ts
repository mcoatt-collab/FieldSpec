import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getJWTMaxAge } from "@/lib/auth/jwt";
import { login } from "@/services/auth/auth.service";
import { authLimiter } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || (request as any).ip || "unknown";
    const limit = await authLimiter(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: { message: "Too many login attempts. Please try again later.", code: "RATE_LIMITED" } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const loginResult = await login(email, password);

    if (!loginResult.success || !loginResult.token) {
      const statusCode = loginResult.error === "Please verify your email first" ? 403 : 401;
      return NextResponse.json(
        { error: { message: loginResult.error, code: "AUTH_FAILED" } },
        { status: statusCode }
      );
    }

    const response = NextResponse.json(
      { data: { token: loginResult.token, userId: loginResult.userId } },
      { status: 200 }
    );

    response.cookies.set("auth_token", loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getJWTMaxAge(),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
