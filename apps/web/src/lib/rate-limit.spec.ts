import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "./rate-limit";

describe("Rate Limiting Security Layer", () => {
  it("allows requests within the limit", () => {
    const key = `test-ip-${Date.now()}-1`;
    const res1 = checkRateLimit(key, { intervalMs: 10_000, maxRequests: 3 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(key, { intervalMs: 10_000, maxRequests: 3 });
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(key, { intervalMs: 10_000, maxRequests: 3 });
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const key = `test-ip-${Date.now()}-2`;
    checkRateLimit(key, { intervalMs: 10_000, maxRequests: 2 });
    checkRateLimit(key, { intervalMs: 10_000, maxRequests: 2 });

    const blocked = checkRateLimit(key, { intervalMs: 10_000, maxRequests: 2 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetMs).toBeGreaterThan(0);
  });

  it("extracts IP correctly from x-forwarded-for header", () => {
    const req = new Request("https://dellicstravels.com/api/auth/login", {
      headers: {
        "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
      },
    });
    expect(getClientIp(req)).toBe("203.0.113.195");
  });

  it("falls back to x-real-ip if forwarded is missing", () => {
    const req = new Request("https://dellicstravels.com/api/auth/login", {
      headers: {
        "x-real-ip": "198.51.100.42",
      },
    });
    expect(getClientIp(req)).toBe("198.51.100.42");
  });
});
