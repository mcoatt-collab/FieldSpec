import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (process.env.NODE_ENV === "production" && JWT_SECRET === "dev-secret-change-in-production") {
  throw new Error("JWT_SECRET must be changed from default value in production");
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface JWTResult {
  token: string;
  expiresAt: Date;
}

export function signJWT(payload: JWTPayload): JWTResult {
  const expiresAt = new Date();
  const duration = parseDuration(JWT_EXPIRES_IN);
  expiresAt.setTime(expiresAt.getTime() + duration);

  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60,
  };

  const token = jwt.sign(payload, JWT_SECRET, options);

  return { token, expiresAt };
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}
