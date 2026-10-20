import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService({ maxEntries: 3, defaultTtlMs: 500 });
  });

  afterEach(() => {
    cache.onModuleDestroy();
  });

  it('sets and retrieves cached values within TTL', () => {
    cache.set('key1', { name: 'Dellics' });
    const result = cache.get<{ name: string }>('key1');
    expect(result).toEqual({ name: 'Dellics' });
    expect(cache.getMetrics().hits).toBe(1);
    expect(cache.getMetrics().misses).toBe(0);
  });

  it('returns undefined and counts miss when key does not exist', () => {
    const result = cache.get('non_existent');
    expect(result).toBeUndefined();
    expect(cache.getMetrics().hits).toBe(0);
    expect(cache.getMetrics().misses).toBe(1);
  });

  it('expires entries after TTL', async () => {
    cache.set('short_lived', 'value', 50);
    expect(cache.get('short_lived')).toBe('value');

    await new Promise((resolve) => setTimeout(resolve, 70));
    expect(cache.get('short_lived')).toBeUndefined();
    expect(cache.getMetrics().expirations).toBeGreaterThanOrEqual(1);
  });

  it('enforces bounded capacity with LRU eviction', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.size).toBe(3);

    // Access 'a' to make it most recently used (order now: b, c, a)
    expect(cache.get('a')).toBe(1);

    // Insert 'd' (exceeds maxEntries=3) -> 'b' should be evicted!
    cache.set('d', 4);

    expect(cache.size).toBe(3);
    expect(cache.get('b')).toBeUndefined(); // evicted
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
    expect(cache.getMetrics().evictions).toBe(1);
  });

  it('deletes specific keys via del()', () => {
    cache.set('target', 'data');
    expect(cache.has('target')).toBe(true);

    const deleted = cache.del('target');
    expect(deleted).toBe(true);
    expect(cache.has('target')).toBe(false);
    expect(cache.get('target')).toBeUndefined();
  });

  it('invalidates by prefix pattern', () => {
    cache.set('reviews:featured', [1, 2]);
    cache.set('reviews:all:approved', [1, 2, 3]);
    cache.set('hotels:dubai', { id: 101 });

    const purged = cache.invalidatePrefix('reviews:');
    expect(purged).toBe(2);

    expect(cache.get('reviews:featured')).toBeUndefined();
    expect(cache.get('reviews:all:approved')).toBeUndefined();
    expect(cache.get('hotels:dubai')).toEqual({ id: 101 });
  });

  it('calculates hit ratio accurately in metrics', () => {
    cache.set('k1', 'val');
    cache.get('k1'); // hit 1
    cache.get('k1'); // hit 2
    cache.get('k2'); // miss 1

    const metrics = cache.getMetrics();
    expect(metrics.hits).toBe(2);
    expect(metrics.misses).toBe(1);
    expect(metrics.hitRatio).toBeCloseTo(2 / 3, 2);
  });

  it('resets all cache items and metrics', () => {
    cache.set('k1', 'val');
    cache.get('k1');
    cache.reset();

    expect(cache.size).toBe(0);
    expect(cache.get('k1')).toBeUndefined();
    expect(cache.getMetrics().hits).toBe(0);
    expect(cache.getMetrics().misses).toBe(1); // from the get('k1') after reset
  });
});
