import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IHotelProvider } from '../interfaces/hotel-provider.interface';
import {
  HotelSearchCriteria,
  NormalizedHotelWithRates,
  HotelBookingRequest,
  HotelBookingResponse,
  NormalizedHotel,
} from '../interfaces/hotel.types';

@Injectable()
export class HotelbedsProvider implements IHotelProvider {
  public readonly name = 'hotelbeds';
  private readonly logger = new Logger(HotelbedsProvider.name);

  constructor(private configService: ConfigService) {}

  async search(criteria: HotelSearchCriteria): Promise<NormalizedHotelWithRates[]> {
    this.logger.log(`Searching Hotelbeds for destination: ${criteria.destination}`);
    
    // Sandbox / Mock Implementation
    const hotelbedsDest = criteria.destination || 'Global City';
    return [{
      hotelId: `hb-${Date.now()}`,
      provider: this.name,
      name: `Grand Hotelbeds Resort ${hotelbedsDest}`,
      rating: 5,
      location: {
        address: `123 Hotelbeds Avenue, Central`,
        city: hotelbedsDest,
        country: 'US'
      },
      description: 'Iconic luxury resort by Hotelbeds.',
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      amenities: ['Private Beach', 'Pool', 'Spa'],
      rates: [
        {
          rateId: `hb-rate-${Date.now()}`,
          roomName: 'Ocean King Room',
          boardType: 'Breakfast Included',
          price: 450,
          currency: criteria.currency || 'USD',
          supplier: this.name,
          cancellationPolicy: {
            isRefundable: true,
            freeCancellationUntil: '2027-10-01'
          }
        }
      ]
    }];
  }

  async verifyRate(rateId: string): Promise<boolean> {
    this.logger.log(`Verifying Hotelbeds rate: ${rateId}`);
    return true; // Mock success
  }

  async book(request: HotelBookingRequest): Promise<HotelBookingResponse> {
    this.logger.log(`Booking Hotelbeds rate: ${request.rateId}`);
    return {
      success: true,
      bookingId: `HB-BK-${Date.now()}`,
      status: 'CONFIRMED'
    };
  }

  async getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]> {
    return [];
  }
}
