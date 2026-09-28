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
export class ExpediaProvider implements IHotelProvider {
  public readonly name = 'expedia';
  private readonly logger = new Logger(ExpediaProvider.name);

  constructor(private configService: ConfigService) {}

  async search(criteria: HotelSearchCriteria): Promise<NormalizedHotelWithRates[]> {
    this.logger.log(`Searching Expedia (EPS Rapid) for destination: ${criteria.destination}`);
    const expediaDest = criteria.destination || 'Global City';
    return [{
      hotelId: `exp-${Date.now()}`,
      provider: this.name,
      name: `Expedia Boutique Hotel ${expediaDest}`,
      rating: 4,
      location: {
        address: `456 Expedia Blvd`,
        city: expediaDest,
        country: 'US'
      },
      description: 'Chic boutique hotel by Expedia.',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      amenities: ['Free WiFi', 'Fitness Center', 'Restaurant'],
      rates: [
        {
          rateId: `exp-rate-${Date.now()}`,
          roomName: 'Standard Queen Room',
          boardType: 'Room Only',
          price: 380,
          currency: criteria.currency || 'USD',
          supplier: this.name,
          cancellationPolicy: {
            isRefundable: false
          }
        }
      ]
    }];
  }

  async verifyRate(rateId: string): Promise<boolean> {
    this.logger.log(`Verifying Expedia rate: ${rateId}`);
    return true; 
  }

  async book(request: HotelBookingRequest): Promise<HotelBookingResponse> {
    this.logger.log(`Booking Expedia rate: ${request.rateId}`);
    return {
      success: true,
      bookingId: `EXP-BK-${Date.now()}`,
      status: 'CONFIRMED'
    };
  }

  async getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]> {
    return [];
  }
}
