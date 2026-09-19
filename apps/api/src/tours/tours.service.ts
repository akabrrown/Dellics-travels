import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async getTours(query: any) {
    return this.prisma.tourPackage.findMany({
      where: {
        // filter logic
      },
    });
  }

  async getTourBySlug(slug: string) {
    const tour = await this.prisma.tourPackage.findUnique({
      where: { slug },
    });
    if (!tour) throw new NotFoundException('Tour not found');
    return tour;
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