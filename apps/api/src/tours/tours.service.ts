import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

    async getTours(query: any) {
    const where: any = {};
    if (query.featured) where.is_featured = query.featured === 'true';
    if (query.destination) where.destination = { contains: query.destination, mode: 'insensitive' };
    if (query.segment) where.segment = query.segment;

    const data = await this.prisma.tourPackage.findMany({ where });
    
    // Map to frontend expected format
    return {
      status: 'success',
      provider: 'database',
      count: data.length,
      data: data.map(d => ({
        id: d.id,
        name: d.title,
        slug: d.slug,
        destination: d.destination,
        price: d.price.toString(),
        rawPrice: Number(d.price),
        currency: d.currency,
        duration: d.duration,
        badge: d.badge,
        segment: d.segment,
        image: d.image_url,
        copy: d.overview,
        includes: d.includes,
        highlights: d.highlights,
        isFeatured: d.is_featured
      }))
    };
  }

  async getTourBySlug(slug: string) {
    const tour = await this.prisma.tourPackage.findUnique({ where: { slug } });
    if (!tour) throw new NotFoundException('Tour not found');
    return tour;
  }

  async createTour(body: any) {
    return this.prisma.tourPackage.create({
      data: {
        title: body.title,
        slug: body.slug,
        destination: body.destination,
        price: body.price,
        currency: body.currency || 'USD',
        duration: body.duration,
        badge: body.badge,
        segment: body.segment,
        image_url: body.image,
        overview: body.overview,
        includes: body.includes || [],
        highlights: body.highlights || [],
        is_featured: body.isFeatured || false,
      }
    });
  }

  async updateTour(id: string, body: any) {
    return this.prisma.tourPackage.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        destination: body.destination,
        price: body.price,
        currency: body.currency,
        duration: body.duration,
        badge: body.badge,
        segment: body.segment,
        image_url: body.image,
        overview: body.overview,
        includes: body.includes,
        highlights: body.highlights,
        is_featured: body.isFeatured,
      }
    });
  }

  async createBooking(userId: string, body: any) {
    // Generate a placeholder reference for Paystack
    const ref = 'TR_' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const booking = await this.prisma.tourBooking.create({
      data: {
        user_id: userId,
        tour_package_id: body.tourId,
        departure_date: new Date(body.departureDate),
        pax_count: body.paxCount,
        lead_pax_name: body.leadName,
        lead_pax_email: body.leadEmail,
        lead_pax_phone: body.leadPhone,
        special_requests: body.specialRequests,
        paystack_reference: ref,
        amount: body.amount,
        currency: 'USD',
      },
    });

    // Mock Paystack init
    return {
      bookingId: booking.id,
      authorizationUrl: 'https://checkout.paystack.com/test_url',
      reference: ref,
    };
  }
}
