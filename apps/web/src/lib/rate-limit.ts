/**
 * Sliding Window In-Memory Rate Limiter for Next.js API Routes & Edge Functions
 * Provides defense-in-depth against brute force, credential stuffing, and spam attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 10 * 60 * 1000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Time window in milliseconds (e.g. 60_000 for 1 minute) */
  intervalMs: number;
  /** Maximum number of allowed requests in the interval */
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Extracts a robust client IP identifier from standard proxy/CDN headers
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "127.0.0.1";
}

/**
 * Checks and records a rate-limit event for a specific key
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const { intervalMs, maxRequests } = options;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < intervalMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0] || now;
    const resetMs = Math.max(0, intervalMs - (now - oldest));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, maxRequests - record.timestamps.length);
  const oldest = record.timestamps[0] || now;
  const resetMs = Math.max(0, intervalMs - (now - oldest));

  return {
    success: true,
    limit: maxRequests,
    remaining,
    resetMs,
  };
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  /** 5 requests per minute for high-sensitivity auth & password endpoints */
  auth: (ip: string) =>
    checkRateLimit(`auth:${ip}`, { intervalMs: 60_000, maxRequests: 5 }),

  /** 10 requests per minute for public booking, inquiry, and order submissions */
  inquiry: (ip: string) =>
    checkRateLimit(`inquiry:${ip}`, { intervalMs: 60_000, maxRequests: 10 }),

  /** 60 requests per minute for search and read queries */
  search: (ip: string) =>
    checkRateLimit(`search:${ip}`, { intervalMs: 60_000, maxRequests: 60 }),
};
