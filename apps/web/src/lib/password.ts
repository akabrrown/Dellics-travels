import crypto from "node:crypto";

/**
 * Derives a secure scrypt password hash using a 16-byte cryptographically random salt.
 * Formatted as: `${salt}:${hash}`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Constant-time password verification using timingSafeEqual to prevent side-channel timing attacks.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    if (!combinedHash || typeof combinedHash !== "string") return false;
    const parts = combinedHash.split(":");
    if (parts.length !== 2) return false;

    const [salt, expectedHex] = parts;
    if (!salt || !expectedHex) return false;

    const expectedBuffer = Buffer.from(expectedHex, "hex");
    const derivedBuffer = crypto.scryptSync(password, salt, 64);

    if (expectedBuffer.length !== derivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * Hashes a high-entropy plain token with SHA-256 for secure database storage.
 * Follows OWASP guidance: plain tokens are never stored directly in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates a 32-byte cryptographically secure random token, its SHA-256 hash, and a 60-minute expiry date.
 */
export function generateResetToken(): {
  token: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes from now

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

/**
 * Password policy requirements validation.
 */
export function validatePasswordPolicy(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9).");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
