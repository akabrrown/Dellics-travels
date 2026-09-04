import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Admin view: get all reviews with status filtering and search
   */
  async getAllReviews(params?: { status?: string; search?: string }): Promise<{
    status: string;
    count: number;
    data: ReviewItem[];
  }> {
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

      return {
        status: 'success',
        count: items.length,
        data: items,
      };
    } catch (err: any) {
      this.logger.error(`getAllReviews failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }

  /**
   * Moderate review status: APPROVED, FLAGGED, PENDING
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
   * Public: get approved high-rating reviews for website social proof
   */
  async getFeaturedReviews(): Promise<{
    status: string;
    count: number;
    data: ReviewItem[];
  }> {
    const res = await this.getAllReviews({ status: 'APPROVED' });
    return {
      status: 'success',
      count: res.data.length,
      data: res.data.slice(0, 6),
    };
  }
}
