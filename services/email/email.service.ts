import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "localhost";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "1025", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@fieldspec.app";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

console.log("[Email] SMTP Config:", {
  host: SMTP_HOST,
  port: SMTP_PORT,
  hasAuth: !!SMTP_USER,
  from: EMAIL_FROM,
  appUrl: APP_URL,
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
});

console.log("[Email] Transporter created");

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log("[Email] Attempting to send:", { to: options.subject, from: EMAIL_FROM });
  try {
    const result = await transporter.sendMail({
      from: EMAIL_FROM,
      ...options,
    });
    console.log("[Email] Sent successfully:", result.messageId);
    return true;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[Email] Send failed:", err.message);
    console.error("[Email] Error details:", err.stack);
    return false;
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<boolean> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = `
    <h1>Verify Your Email</h1>
    <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your FieldSpec email",
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = `
    <h1>Reset Your Password</h1>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your FieldSpec password",
    html,
  });
}
