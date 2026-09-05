import { Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

export interface ReviewItem {
  id: string;
  bookingId: string;
  bookingType: string;
  travelerName: string;
  travelerEmail: string;
  rating: number;
  text: string;
  target: string;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
  verifiedStay: boolean;
  createdAt: string;
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private readonly cache: CacheService;

  constructor(
    private readonly prisma: PrismaService,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache = injectedCache || new CacheService({ maxEntries: 200, defaultTtlMs: 2 * 60 * 1000 });
  }

  /**
   * Admin view: get all reviews with status filtering and search (cached with 2m TTL)
   */
  async getAllReviews(params?: { status?: string; search?: string }): Promise<{
    status: string;
    count: number;
    data: ReviewItem[];
  }> {
    const cacheKey = `reviews:all:${params?.status || 'ALL'}:${params?.search || ''}`;
    const cached = this.cache.get<{ status: string; count: number; data: ReviewItem[] }>(cacheKey);
    if (cached) {
      this.logger.debug(`[Cache HIT] Serving cached reviews for key: ${cacheKey}`);
      return cached;
    }
    try {
      const dbReviews = await this.prisma.review.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          user: true,
          booking: {
            include: {
              trip: true,
            },
          },
        },
      });

      let items: ReviewItem[] = dbReviews.map((r) => {
        const meta = (r.sub_scores as Record<string, any>) || {};
        return {
          id: r.id,
          bookingId: r.booking_id,
          bookingType: r.booking?.type || 'HOTEL',
          travelerName: r.user?.name || 'Verified Traveler',
          travelerEmail: r.user?.email || '',
          rating: r.rating,
          text: r.text || '',
          target: meta.target || r.booking?.trip?.title || 'Accommodations & Flights',
          status: (meta.status as any) || 'APPROVED',
          verifiedStay: meta.verifiedStay !== false,
          createdAt: r.created_at.toISOString(),
        };
      });

      if (params?.status && params.status !== 'ALL') {
        items = items.filter((i) => i.status === params.status);
      }

      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (i) =>
            i.travelerName.toLowerCase().includes(q) ||
            i.target.toLowerCase().includes(q) ||
            i.bookingId.toLowerCase().includes(q) ||
            i.text.toLowerCase().includes(q),
        );
      }

      const result = {
        status: 'success',
        count: items.length,
        data: items,
      };

      this.cache.set(cacheKey, result, 2 * 60 * 1000);
      return result;
    } catch (err: any) {
      this.logger.error(`getAllReviews failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }

  /**
   * Moderate review status: APPROVED, FLAGGED, PENDING
   * Automatically invalidates review caches to guarantee consistency
   */
  async moderateReview(id: string, status: 'APPROVED' | 'FLAGGED' | 'PENDING'): Promise<{
    status: string;
    message: string;
    data?: any;
  }> {
    try {
      const existing = await this.prisma.review.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Review with ID ${id} not found.`);
      }

      const currentScores = (existing.sub_scores as Record<string, any>) || {};
      const updated = await this.prisma.review.update({
        where: { id },
        data: {
          sub_scores: {
            ...currentScores,
            status,
            moderatedAt: new Date().toISOString(),
          },
        },
      });

      // Invalidate all review cache keys
      const purged = this.cache.invalidatePrefix('reviews:');
      this.logger.log(`[Cache INVALIDATION] Purged ${purged} review cache entries after moderating review ${id}`);

      return {
        status: 'success',
        message: `Review marked as ${status}.`,
        data: updated,
      };
    } catch (err: any) {
      this.logger.error(`moderateReview failed: ${err.message}`);
      throw err;
    }
  }

  /**
   * Public: get approved high-rating reviews for website social proof (cached with 10m TTL)
   */
  async getFeaturedReviews(): Promise<{
    status: string;
    count: number;
    data: ReviewItem[];
  }> {
    const cacheKey = 'reviews:featured';
    const cached = this.cache.get<{ status: string; count: number; data: ReviewItem[] }>(cacheKey);
    if (cached) {
      this.logger.debug(`[Cache HIT] Serving cached featured reviews`);
      return cached;
    }

    const res = await this.getAllReviews({ status: 'APPROVED' });
    const result = {
      status: 'success',
      count: res.data.length,
      data: res.data.slice(0, 6),
    };

    this.cache.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }
}
