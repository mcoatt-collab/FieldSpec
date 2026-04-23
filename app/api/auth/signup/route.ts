import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signup } from "@/services/auth/auth.service";
import { signupLimiter } from "@/lib/security/rate-limit";
import { passwordSchema } from "@/lib/security/validation";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  companyName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || (request as any).ip || "unknown";
    const limit = await signupLimiter(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: { message: "Too many signup attempts. Please try again later.", code: "RATE_LIMITED" } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email, password, name, companyName } = result.data;
    const signupResult = await signup(email, password, name, companyName);

    if (!signupResult.success) {
      return NextResponse.json(
        { error: { message: signupResult.error, code: "SIGNUP_FAILED" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: { message: "Account created. Please check your email to verify your account." } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
