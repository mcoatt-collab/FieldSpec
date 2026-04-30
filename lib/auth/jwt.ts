import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("[FieldSpec] JWT_SECRET must be set and at least 32 characters. Set it in your .env file.");
  }
  return secret;
};

const JWT_SECRET = getSecret();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_THRESHOLD = process.env.JWT_REFRESH_THRESHOLD || "1d";

export interface JWTPayload {
  userId: string;
  email: string;
  tokenVersion?: number;
  exp?: number;
  iat?: number;
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
    expiresIn: Math.floor(duration / 1000),
    algorithm: "HS256",
  };

  const token = jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      tokenVersion: payload.tokenVersion,
    },
    JWT_SECRET,
    options
  );

  return { token, expiresAt };
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as JwtPayload & JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as (JwtPayload & JWTPayload) | null;
    return decoded;
  } catch {
    return null;
  }
}

export function getJWTMaxAge(): number {
  return Math.floor(parseDuration(JWT_EXPIRES_IN) / 1000);
}

export function shouldRefreshJWT(payload: JWTPayload): boolean {
  if (!payload.exp) return false;

  const refreshThreshold = parseDuration(JWT_REFRESH_THRESHOLD);
  const msUntilExpiry = payload.exp * 1000 - Date.now();

  return msUntilExpiry > 0 && msUntilExpiry <= refreshThreshold;
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
