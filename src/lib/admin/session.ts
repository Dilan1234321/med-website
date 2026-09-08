import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "med_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Creates a signed token of the form "<expiresAtMs>.<hmacHex>". */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

/** Verifies signature and expiry. Never throws — returns false on any problem. */
export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expectedBuf: Buffer;
  let actualBuf: Buffer;
  try {
    expectedBuf = Buffer.from(sign(payload), "hex");
    actualBuf = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  if (expectedBuf.length !== actualBuf.length) return false;
  // Buffer.from(str, "hex") silently truncates at the first invalid hex
  // char instead of throwing, so a tampered signature with garbage
  // appended can decode to a buffer of the same byte length as the
  // expected one. Guard against that by also checking the raw string
  // length before trusting the decoded buffers.
  if (signature.length !== expectedBuf.length * 2) return false;
  if (!timingSafeEqual(expectedBuf, actualBuf)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}
