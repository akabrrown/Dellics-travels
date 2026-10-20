import { describe, it, expect } from "vitest";
import {
  parseUserAgent,
  computeDeviceFingerprint,
  generateVerificationCode,
} from "./device";

describe("Device Identification & Fingerprinting", () => {
  it("should accurately parse Windows Chrome user agent", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    const details = parseUserAgent(ua);
    expect(details.browser).toBe("Google Chrome");
    expect(details.os).toBe("Windows 10/11");
    expect(details.deviceType).toBe("desktop");
    expect(details.deviceName).toBe("Google Chrome on Windows 10/11");
  });

  it("should accurately parse iPhone Safari user agent", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1";
    const details = parseUserAgent(ua);
    expect(details.browser).toBe("Apple Safari");
    expect(details.os).toBe("iOS (iPhone)");
    expect(details.deviceType).toBe("mobile");
    expect(details.deviceName).toBe("Apple Safari on iOS (iPhone)");
  });

  it("should compute consistent deterministic SHA-256 fingerprint", () => {
    const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
    const fp1 = computeDeviceFingerprint(ua, "entropy-token-1");
    const fp2 = computeDeviceFingerprint(ua, "entropy-token-1");
    const fp3 = computeDeviceFingerprint(ua, "entropy-token-2");

    expect(fp1).toHaveLength(64);
    expect(fp1).toBe(fp2);
    expect(fp1).not.toBe(fp3);
  });

  it("should generate a 2-digit verification code between 10 and 99", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateVerificationCode();
      expect(code).toMatch(/^\d{2}$/);
      const num = parseInt(code, 10);
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(99);
    }
  });
});
