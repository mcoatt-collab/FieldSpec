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
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 400px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a;">Reset Your Password</h1>
                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #666666; line-height: 1.5;">
                    Click the button below to reset your password.
                  </p>
                  <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1e3a5f; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 6px;">Reset Password</a>
                  <p style="margin: 24px 0 0 0; font-size: 12px; color: #999999;">
                    This link expires in 30 minutes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your FieldSpec password",
    html,
  });
}
