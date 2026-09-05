import { describe, it, expect, beforeEach } from 'vitest';
import { LruTtlCache } from './cache';

describe('LruTtlCache', () => {
  let cache: LruTtlCache;

  beforeEach(() => {
    cache = new LruTtlCache({ maxEntries: 3, defaultTtlMs: 200 });
  });

  it('stores and retrieves cached items within TTL', () => {
    cache.set('hotel:1', { name: 'Burj Al Arab' });
    expect(cache.get('hotel:1')).toEqual({ name: 'Burj Al Arab' });
    expect(cache.getMetrics().hits).toBe(1);
    expect(cache.getMetrics().misses).toBe(0);
  });

  it('handles TTL expiration', async () => {
    cache.set('temp', 'val', 50);
    expect(cache.get('temp')).toBe('val');

    await new Promise((r) => setTimeout(r, 70));
    expect(cache.get('temp')).toBeUndefined();
    expect(cache.getMetrics().expirations).toBe(1);
  });

  it('evicts least recently used entry when maxEntries reached', () => {
    cache.set('k1', 1);
    cache.set('k2', 2);
    cache.set('k3', 3);

    // Access k1 to make it recently used (order: k2, k3, k1)
    expect(cache.get('k1')).toBe(1);

    // Insert k4 -> should evict k2!
    cache.set('k4', 4);

    expect(cache.size).toBe(3);
    expect(cache.get('k2')).toBeUndefined();
    expect(cache.get('k1')).toBe(1);
    expect(cache.get('k3')).toBe(3);
    expect(cache.get('k4')).toBe(4);
    expect(cache.getMetrics().evictions).toBe(1);
  });
});
