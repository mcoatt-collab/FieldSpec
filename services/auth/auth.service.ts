import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateToken, hashToken, isTokenExpired } from "@/lib/auth/token";
import { signJWT } from "@/lib/auth/jwt";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/services/email/email.service";

const TOKEN_TYPE_EMAIL_VERIFICATION = "email_verification";
const TOKEN_TYPE_PASSWORD_RESET = "password_reset";

export interface SignupResult {
  success: boolean;
  error?: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  userId?: string;
  error?: string;
}

export interface ForgotPasswordResult {
  success: boolean;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export interface VerifyEmailResult {
  success: boolean;
  error?: string;
}

export async function signup(
  email: string,
  password: string,
  name: string,
  companyName?: string
): Promise<SignupResult> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        companyName,
        authProvider: "email",
        isVerified: true,
      },
    });

    const tokenData = generateToken();
    await prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash: tokenData.hash,
        type: TOKEN_TYPE_EMAIL_VERIFICATION,
        expiresAt: tokenData.expiresAt,
      },
    });

    const emailSent = await sendVerificationEmail(email, tokenData.raw);
    if (!emailSent) {
      console.error(`[Auth] Failed to send verification email to ${email}`);
    } else {
      console.log(`[Auth] Verification email sent to ${email}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Registration failed" };
  }
}

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  console.log("[Auth] Verifying email with token:", token.substring(0, 20) + "...");
  try {
    const tokenHash = hashToken(token);

    const authToken = await prisma.authToken.findFirst({
      where: {
        tokenHash,
        type: TOKEN_TYPE_EMAIL_VERIFICATION,
        isUsed: false,
      },
      include: {
        user: true,
      },
    });

    console.log("[Auth] Token lookup result:", authToken ? "found" : "not found");

    if (!authToken) {
      console.log("[Auth] Token not found in database");
      return { success: false, error: "Invalid token" };
    }

    if (authToken.user.isVerified) {
      console.log("[Auth] User already verified");
      return { success: false, error: "Email already verified" };
    }

    if (isTokenExpired(authToken.expiresAt)) {
      console.log("[Auth] Token expired at:", authToken.expiresAt);
      return { success: false, error: "Token expired" };
    }

    console.log("[Auth] Token valid, verifying user:", authToken.user.email);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: authToken.userId },
        data: { isVerified: true },
      }),
      prisma.authToken.update({
        where: { id: authToken.id },
        data: { isUsed: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "Verification failed" };
  }
}

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    if (!user.passwordHash) {
      return { success: false, error: "Invalid credentials" };
    }

    // Email verification temporarily disabled
    // if (!user.isVerified) {
    //   return { success: false, error: "Please verify your email first" };
    // }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    const jwtResult = signJWT({ userId: user.id, email: user.email });

    return { success: true, token: jwtResult.token, userId: user.id };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.authProvider !== "email" || !user.passwordHash) {
      return { success: true };
    }

    const tokenData = generateToken();
    await prisma.authToken.create({
      data: {
        userId: user.id,
        tokenHash: tokenData.hash,
        type: TOKEN_TYPE_PASSWORD_RESET,
        expiresAt: tokenData.expiresAt,
      },
    });

    const emailSent = await sendPasswordResetEmail(email, tokenData.raw);
    if (!emailSent) {
      console.error(`Failed to send password reset email to ${email}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: true };
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    const tokenHash = hashToken(token);

    const authToken = await prisma.authToken.findFirst({
      where: {
        tokenHash,
        type: TOKEN_TYPE_PASSWORD_RESET,
        isUsed: false,
      },
      include: {
        user: true,
      },
    });

    if (!authToken) {
      return { success: false, error: "Invalid token" };
    }

    if (isTokenExpired(authToken.expiresAt)) {
      return { success: false, error: "Token expired" };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: authToken.userId },
        data: { passwordHash },
      }),
      prisma.authToken.update({
        where: { id: authToken.id },
        data: { isUsed: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Reset failed" };
  }
}
