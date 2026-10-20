import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common';

export interface CacheOptions {
  maxEntries?: number;
  defaultTtlMs?: number;
  sweepIntervalMs?: number;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  expirations: number;
  size: number;
  maxCapacity: number;
  hitRatio: number;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly store = new Map<string, CacheEntry<any>>();
  private readonly maxEntries: number;
  private readonly defaultTtlMs: number;
  private readonly sweepTimer: ReturnType<typeof setInterval> | null = null;

  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private expirations = 0;

  constructor(@Optional() options?: CacheOptions) {
    this.maxEntries = options?.maxEntries ?? 1000;
    this.defaultTtlMs = options?.defaultTtlMs ?? 5 * 60 * 1000; // 5 mins default

    const sweepInterval = options?.sweepIntervalMs ?? 60_000;
    if (sweepInterval > 0) {
      const timer = setInterval(() => this.sweepExpired(), sweepInterval);
      if (timer && typeof timer === 'object' && 'unref' in timer) {
        (timer as any).unref();
      }
      this.sweepTimer = timer;
    }
  }

  onModuleDestroy() {
    if (this.sweepTimer !== null) {
      clearInterval(this.sweepTimer);
    }
  }

  get size(): number {
    return this.store.size;
  }

  /**
   * O(1) Get with LRU recency update and TTL check
   */
  get<T = any>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.store.delete(key);
      this.expirations++;
      this.misses++;
      return undefined;
    }

    // Refresh LRU position (delete and re-insert moves to end of Map in O(1))
    this.store.delete(key);
    this.store.set(key, entry);

    this.hits++;
    return entry.value as T;
  }

  /**
   * O(1) Set with bounded capacity enforcement via LRU eviction
   */
  set<T = any>(key: string, value: T, ttlMs?: number): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      // Oldest / least recently used key is the first iterator entry
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
        this.evictions++;
      }
    }

    const ttl = ttlMs !== undefined && ttlMs > 0 ? ttlMs : this.defaultTtlMs;
    const expiresAt = Date.now() + ttl;

    this.store.set(key, { value, expiresAt });
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.expirations++;
      return false;
    }
    return true;
  }

  del(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Invalidates all keys matching a prefix (e.g. 'reviews:')
   */
  invalidatePrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  reset(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.expirations = 0;
  }

  getMetrics(): CacheMetrics {
    const totalRequests = this.hits + this.misses;
    const hitRatio = totalRequests > 0 ? this.hits / totalRequests : 0;

    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      expirations: this.expirations,
      size: this.store.size,
      maxCapacity: this.maxEntries,
      hitRatio,
    };
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        this.expirations++;
      }
    }
  }
}
