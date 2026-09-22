import {
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

export interface ReviewItem {
  id: string;
  bookingId: string | null;
  bookingType: string | null;
  travelerName: string;
  travelerEmail: string;
  rating: number;
  text: string;
  target: string;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
  verifiedStay: boolean;
  createdAt: string;
  source?: string | null;
}

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private readonly cache: CacheService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache =
      injectedCache ||
      new CacheService({ maxEntries: 200, defaultTtlMs: 2 * 60 * 1000 });
  }

  /**
   * Fetch live Google Place reviews and upsert them into the DB.
   * Called on demand (GET /reviews/sync-google) and cached for 1 hour.
   * The API key NEVER leaves the server — it is read from env vars only.
   */
  async syncGoogleReviews(): Promise<{ synced: number; errors: string[] }> {
    const cacheKey = 'reviews:google:sync';
    const cached = this.cache.get<{ synced: number; errors: string[] }>(cacheKey);
    if (cached) return cached;

    const apiKey = this.config.get<string>('GOOGLE_PLACES_API_KEY');
    const placeId = this.config.get<string>('GOOGLE_PLACE_ID');

    if (!apiKey || !placeId) {
      this.logger.warn('GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — skipping sync');
      return { synced: 0, errors: ['Google Places credentials not configured'] };
    }

    const errors: string[] = [];
    let synced = 0;

    try {
      // Google Places API (New) — placeDetails endpoint
      const url = `https://places.googleapis.com/v1/places/${placeId}`;
      const res = await fetch(url, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(`Google Places API error ${res.status}: ${errText}`);
        return { synced: 0, errors: [`Google API ${res.status}: ${errText.slice(0, 200)}`] };
      }

      const place = await res.json() as {
        id?: string;
        displayName?: { text?: string };
        rating?: number;
        userRatingCount?: number;
        reviews?: Array<{
          name?: string;
          relativePublishTimeDescription?: string;
          rating?: number;
          text?: { text?: string; languageCode?: string };
          originalText?: { text?: string };
          authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
          publishTime?: string;
        }>;
      };

      const reviews = place.reviews || [];
      this.logger.log(`Google Places returned ${reviews.length} reviews for place ${placeId}`);

      for (const r of reviews) {
        const reviewText = r.text?.text || r.originalText?.text || '';
        const authorName = r.authorAttribution?.displayName || 'Google Reviewer';
        const rating = r.rating ?? 5;
        const publishTime = r.publishTime ? new Date(r.publishTime) : new Date();
        // Use the review name (e.g. "places/xxx/reviews/yyy") as an idempotency key
        const externalId = r.name || `google-${placeId}-${authorName}`;

        if (!reviewText.trim()) continue; // skip rating-only reviews with no text

        try {
          // Upsert: if a review with the same external ID already exists, update it
          const existing = await this.prisma.review.findFirst({
            where: { external_id: externalId },
          });

          const data: any = {
            source: 'GOOGLE',
            reviewer_name: authorName,
            rating,
            text: reviewText,
            external_id: externalId,
            created_at: publishTime,
            sub_scores: {
              target: 'Dellics Travels',
              status: 'APPROVED',
              verifiedStay: false,
              placeId,
              authorUri: r.authorAttribution?.uri,
              relativeTime: r.relativePublishTimeDescription,
            },
          };

          if (existing) {
            await this.prisma.review.update({ where: { id: existing.id }, data });
          } else {
            await this.prisma.review.create({ data });
          }
          synced++;
        } catch (upsertErr: any) {
          this.logger.warn(`Failed to upsert review ${externalId}: ${upsertErr.message}`);
          errors.push(upsertErr.message);
        }
      }

      this.cache.invalidatePrefix('reviews:');
      const result = { synced, errors };
      this.cache.set(cacheKey, result, 60 * 60 * 1000); // 1 hour cache
      return result;
    } catch (err: any) {
      this.logger.error(`syncGoogleReviews failed: ${err.message}`);
      return { synced: 0, errors: [err.message] };
    }
  }

  /**
   * Fetch live Trustpilot reviews and upsert them into the DB.
   * Called on demand (GET /reviews/sync-trustpilot) and cached for 1 hour.
   */
  async syncTrustpilotReviews(): Promise<{ synced: number; errors: string[] }> {
    const cacheKey = 'reviews:trustpilot:sync';
    const cached = this.cache.get<{ synced: number; errors: string[] }>(cacheKey);
    if (cached) return cached;

    const apiKey = this.config.get<string>('TRUSTPILOT_API_KEY');
    const buId = this.config.get<string>('TRUSTPILOT_BUSINESS_UNIT_ID');

    if (!apiKey || !buId) {
      this.logger.warn('TRUSTPILOT_API_KEY or TRUSTPILOT_BUSINESS_UNIT_ID not set — skipping sync');
      return { synced: 0, errors: ['Trustpilot credentials not configured'] };
    }

    const errors: string[] = [];
    let synced = 0;

    try {
      // Trustpilot B2B API — get reviews for a business unit
      const url = "https://api.trustpilot.com/v1/business-units/" + buId + "/reviews?stars=4,5&perPage=50;
      const res = await fetch(url, {
        headers: {
          'apikey': apiKey,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(Trustpilot API error : );
        return { synced: 0, errors: [Trustpilot API : ] };
      }

      const data = await res.json() as {
        reviews?: Array<{
          id: string;
          text: string;
          stars: number;
          createdAt: string;
          consumer: { displayName: string };
        }>;
      };

      const reviews = data.reviews || [];
      this.logger.log(Trustpilot returned  reviews for buId );

      for (const r of reviews) {
        if (!r.text?.trim()) continue; // skip empty reviews

        const externalId = 	rustpilot-;

        try {
          const existing = await this.prisma.review.findFirst({
            where: { external_id: externalId },
          });

          const payload: any = {
            source: 'TRUSTPILOT',
            reviewer_name: r.consumer?.displayName || 'Trustpilot Reviewer',
            rating: r.stars,
            text: r.text,
            external_id: externalId,
            created_at: new Date(r.createdAt),
            sub_scores: {
              target: 'Dellics Travels',
              status: 'APPROVED',
              verifiedStay: true,
              sourceId: r.id,
            },
          };

          if (existing) {
            await this.prisma.review.update({ where: { id: existing.id }, data: payload });
          } else {
            await this.prisma.review.create({ data: payload });
          }
          synced++;
        } catch (upsertErr: any) {
          this.logger.warn(Failed to upsert Trustpilot review : );
          errors.push(upsertErr.message);
        }
      }

      this.cache.invalidatePrefix('reviews:');
      const result = { synced, errors };
      this.cache.set(cacheKey, result, 60 * 60 * 1000); // 1 hour cache
      return result;
    } catch (err: any) {
      this.logger.error(syncTrustpilotReviews failed: );
      return { synced: 0, errors: [err.message] };
    }
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
    const cached = this.cache.get<{
      status: string;
      count: number;
      data: ReviewItem[];
    }>(cacheKey);
    if (cached) {
      this.logger.debug(
        `[Cache HIT] Serving cached reviews for key: ${cacheKey}`,
      );
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
          travelerName: r.reviewer_name || r.user?.name || 'Verified Traveler',
          travelerEmail: r.user?.email || '',
          rating: r.rating,
          text: r.text || '',
          target:
            meta.target || r.booking?.trip?.title || 'Accommodations & Flights',
          status: meta.status || 'APPROVED',
          verifiedStay: meta.verifiedStay !== false,
          createdAt: r.created_at.toISOString(),
          source: r.source,
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
            (i.bookingId && i.bookingId.toLowerCase().includes(q)) ||
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
   */
  async moderateReview(
    id: string,
    status: 'APPROVED' | 'FLAGGED' | 'PENDING',
  ): Promise<{
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

      const purged = this.cache.invalidatePrefix('reviews:');
      this.logger.log(
        `[Cache INVALIDATION] Purged ${purged} review cache entries after moderating review ${id}`,
      );

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

  async addExternalReview(dto: {
    travelerName: string;
    rating: number;
    text: string;
    target: string;
    source: 'TRUSTPILOT' | 'GOOGLE';
  }) {
    try {
      const created = await this.prisma.review.create({
        data: {
          source: dto.source,
          reviewer_name: dto.travelerName,
          rating: dto.rating,
          text: dto.text,
          sub_scores: { target: dto.target, status: 'APPROVED', verifiedStay: false },
        },
      });

      this.cache.invalidatePrefix('reviews:');
      return { status: 'success', data: created };
    } catch (err: any) {
      this.logger.error(`addExternalReview failed: ${err.message}`);
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
    const cached = this.cache.get<{
      status: string;
      count: number;
      data: ReviewItem[];
    }>(cacheKey);
    if (cached) {
      this.logger.debug(`[Cache HIT] Serving cached featured reviews`);
      return cached;
    }

    const res = await this.getAllReviews({ status: 'APPROVED' });
    // Prioritize Google reviews (real), then sort by rating desc
    const sorted = res.data
      .filter((r) => r.rating >= 4)
      .sort((a, b) => {
        const aIsGoogle = a.source === 'GOOGLE' ? 1 : 0;
        const bIsGoogle = b.source === 'GOOGLE' ? 1 : 0;
        if (bIsGoogle !== aIsGoogle) return bIsGoogle - aIsGoogle;
        return b.rating - a.rating;
      });

    const result = {
      status: 'success',
      count: sorted.length,
      data: sorted.slice(0, 6),
    };

    this.cache.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }
}