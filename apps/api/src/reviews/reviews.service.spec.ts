import { ReviewsService } from './reviews.service';
import { CacheService } from '../cache/cache.service';

describe('ReviewsService Cache & Invalidation', () => {
  let service: ReviewsService;
  let cache: CacheService;
  let mockPrisma: any;

  beforeEach(() => {
    cache = new CacheService({ maxEntries: 100, defaultTtlMs: 60_000 });
    mockPrisma = {
      review: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'rev-1',
            booking_id: 'bk-1',
            rating: 5,
            text: 'Outstanding luxury flight concierge!',
            created_at: new Date('2026-08-01T12:00:00Z'),
            sub_scores: { status: 'APPROVED', target: 'Business Class Flight' },
            user: { name: 'Dr. Sarah Jenkins', email: 'sarah@example.com' },
            booking: { type: 'FLIGHT', trip: { title: 'Accra to London' } },
          },
        ]),
        findUnique: jest.fn().mockResolvedValue({
          id: 'rev-1',
          sub_scores: { status: 'PENDING' },
        }),
        update: jest.fn().mockResolvedValue({
          id: 'rev-1',
          sub_scores: { status: 'APPROVED' },
        }),
      },
    };

    service = new ReviewsService(mockPrisma, cache);
  });

  afterEach(() => {
    cache.onModuleDestroy();
  });

  it('caches getAllReviews and avoids duplicate database queries', async () => {
    const res1 = await service.getAllReviews({ status: 'APPROVED' });
    expect(res1.count).toBe(1);
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(1);

    // Second call should hit the cache without calling Prisma again
    const res2 = await service.getAllReviews({ status: 'APPROVED' });
    expect(res2.count).toBe(1);
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(1);
    expect(cache.getMetrics().hits).toBe(1);
  });

  it('caches getFeaturedReviews', async () => {
    const res1 = await service.getFeaturedReviews();
    expect(res1.count).toBe(1);
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(1);

    const res2 = await service.getFeaturedReviews();
    expect(res2.count).toBe(1);
    // Still 1 DB call because featured review was served from cache
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(1);
  });

  it('invalidates review cache upon moderateReview mutation', async () => {
    // Populate cache
    await service.getAllReviews({ status: 'APPROVED' });
    await service.getFeaturedReviews();
    expect(cache.has('reviews:all:APPROVED:')).toBe(true);
    expect(cache.has('reviews:featured')).toBe(true);

    // Moderate review (mutation)
    await service.moderateReview('rev-1', 'APPROVED');

    // Both caches must be invalidated!
    expect(cache.has('reviews:all:APPROVED:')).toBe(false);
    expect(cache.has('reviews:featured')).toBe(false);

    // Next query must hit the database again
    await service.getAllReviews({ status: 'APPROVED' });
    expect(mockPrisma.review.findMany).toHaveBeenCalledTimes(2);
  });
});
