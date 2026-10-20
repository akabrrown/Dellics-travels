import { createHash } from "crypto";

export interface ParsedDevice {
  browser: string;
  os: string;
  deviceType: "mobile" | "tablet" | "desktop";
  deviceName: string;
  fingerprint: string;
}

/**
 * Parses User-Agent header and returns clean browser, OS, and device details.
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  deviceType: "mobile" | "tablet" | "desktop";
  deviceName: string;
} {
  const ua = userAgent || "";
  let browser = "Web Browser";
  let os = "Unknown Device";
  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";

  // 1. Detect Mobile / Tablet first (as iPhone/iPad contain Mac OS X substrings)
  if (/iphone/i.test(ua)) {
    os = "iOS (iPhone)";
    deviceType = "mobile";
  } else if (/ipad/i.test(ua)) {
    os = "iPadOS";
    deviceType = "tablet";
  } else if (/android/i.test(ua)) {
    os = "Android";
    deviceType = /mobile/i.test(ua) ? "mobile" : "tablet";
  } else if (/windows/i.test(ua)) {
    os = "Windows";
    if (/windows nt 10/i.test(ua)) os = "Windows 10/11";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // 2. Detect Browser
  if (/edg/i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  const deviceName = `${browser} on ${os}`;

  return {
    browser,
    os,
    deviceType,
    deviceName,
  };
}

/**
 * Computes deterministic SHA-256 fingerprint from user agent and optional client tokens.
 */
export function computeDeviceFingerprint(
  userAgent: string,
  clientEntropy?: string,
): string {
  const payload = `${userAgent || "unknown"}::${clientEntropy || "default"}`;
  return createHash("sha256").update(payload).digest("hex");
}

/**
 * Generates a 2-digit verification code matching Google 2-step prompt (e.g., "42", "87").
 */
export function generateVerificationCode(): string {
  return Math.floor(10 + Math.random() * 90).toString();
}

/**
 * Extracts approximate location or country from request headers.
 */
export function extractCoarseLocation(headers: Headers): string {
  const city = headers.get("x-vercel-ip-city");
  const country = headers.get("x-vercel-ip-country");
  const countryName = headers.get("x-vercel-ip-country-name");

  if (city && country) {
    return `${city}, ${country}`;
  }
  if (countryName) {
    return countryName;
  }
  if (country) {
    return country === "GH" ? "Accra, Ghana" : country === "US" ? "United States" : country;
  }
  return "Accra, Ghana";
}
