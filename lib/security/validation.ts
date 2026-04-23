import { z } from "zod";

/** Server-side password validation: min 8 chars, 1 uppercase, 1 number */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/** Sanitized email validation */
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(255, "Email too long")
  .transform((e) => e.toLowerCase().trim());
