import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateResetToken,
  validatePasswordPolicy,
} from "./password";

describe("Password Security & Reset Token Infrastructure", () => {
  it("generates scrypt password hashes with unique random salts", () => {
    const rawPassword = "LuxuryTravel2026!";
    const hash1 = hashPassword(rawPassword);
    const hash2 = hashPassword(rawPassword);

    expect(hash1).not.toBe(hash2);
    expect(hash1).toContain(":");
    expect(hash2).toContain(":");

    const [salt1, key1] = hash1.split(":");
    const [salt2, key2] = hash2.split(":");
    expect(salt1).toHaveLength(32); // 16 bytes hex
    expect(key1).toHaveLength(128); // 64 bytes hex
    expect(salt2).toHaveLength(32);
    expect(key2).toHaveLength(128);
  });

  it("verifies passwords correctly and rejects invalid passwords", () => {
    const password = "PassWord123#";
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("WrongPassword123#", hash)).toBe(false);
    expect(verifyPassword("", hash)).toBe(false);
    expect(verifyPassword(password, "invalid-hash-string")).toBe(false);
    expect(verifyPassword(password, "")).toBe(false);
  });

  it("generates cryptographic reset tokens with 60-minute expiration", () => {
    const { token, tokenHash, expiresAt } = generateResetToken();

    expect(token).toHaveLength(64); // 32 bytes hex
    expect(tokenHash).toHaveLength(64); // sha256 hex
    expect(hashToken(token)).toBe(tokenHash);

    const now = Date.now();
    const diffMs = expiresAt.getTime() - now;
    // Should be approximately 60 minutes (allow ±10 seconds for execution time)
    expect(diffMs).toBeGreaterThan(59 * 60 * 1000);
    expect(diffMs).toBeLessThanOrEqual(60 * 60 * 1000 + 5000);
  });

  it("validates password policy compliance correctly", () => {
    // Valid password
    const valid = validatePasswordPolicy("LuxuryTravel2026");
    expect(valid.isValid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    // Too short
    const short = validatePasswordPolicy("Pass1");
    expect(short.isValid).toBe(false);
    expect(short.errors).toContain("Password must be at least 8 characters long.");

    // Missing uppercase
    const noUpper = validatePasswordPolicy("password123");
    expect(noUpper.isValid).toBe(false);
    expect(noUpper.errors).toContain("Password must contain at least one uppercase letter (A-Z).");

    // Missing lowercase
    const noLower = validatePasswordPolicy("PASSWORD123");
    expect(noLower.isValid).toBe(false);
    expect(noLower.errors).toContain("Password must contain at least one lowercase letter (a-z).");

    // Missing number
    const noNumber = validatePasswordPolicy("PasswordOnly");
    expect(noNumber.isValid).toBe(false);
    expect(noNumber.errors).toContain("Password must contain at least one number (0-9).");
  });
});
