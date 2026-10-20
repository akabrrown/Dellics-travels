export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface LruTtlCacheOptions {
  maxEntries?: number;
  defaultTtlMs?: number;
}

export class LruTtlCache<T = any> {
  private readonly store = new Map<string, CacheEntry<T>>();
  private readonly maxEntries: number;
  private readonly defaultTtlMs: number;

  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private expirations = 0;

  constructor(options?: LruTtlCacheOptions) {
    this.maxEntries = options?.maxEntries ?? 500;
    this.defaultTtlMs = options?.defaultTtlMs ?? 5 * 60 * 1000;
  }

  get size(): number {
    return this.store.size;
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.expirations++;
      this.misses++;
      return undefined;
    }

    // Refresh LRU recency
    this.store.delete(key);
    this.store.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
        this.evictions++;
      }
    }

    const ttl = ttlMs !== undefined && ttlMs > 0 ? ttlMs : this.defaultTtlMs;
    this.store.set(key, { value, expiresAt: Date.now() + ttl });
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

  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
    this.expirations = 0;
  }

  getMetrics() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      expirations: this.expirations,
      size: this.store.size,
      maxCapacity: this.maxEntries,
      hitRatio: total > 0 ? this.hits / total : 0,
    };
  }
}
