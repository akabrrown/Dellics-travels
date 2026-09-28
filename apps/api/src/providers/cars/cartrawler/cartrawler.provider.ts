import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICarProvider } from '../interfaces/car-provider.interface';
import { CarSearchCriteria, CarResult } from '../interfaces/car.types';

@Injectable()
export class CartrawlerProvider implements ICarProvider {
  public readonly name = 'cartrawler';
  private readonly logger = new Logger(CartrawlerProvider.name);

  constructor(private configService: ConfigService) {}

  async search(criteria: CarSearchCriteria): Promise<CarResult[]> {
    this.logger.log(`Searching Cartrawler for cars at ${criteria.pickupLocation}`);
    // Mock implementation for Phase 1
    const isTransfer = criteria.pickupLocation?.toLowerCase().includes('airport') || criteria.dropoffLocation?.toLowerCase().includes('airport');
    
    if (isTransfer) {
      return [
        {
          id: `ct-transfer-${Date.now()}`,
          provider: this.name,
          vendorName: 'Cartrawler Transfers',
          vehicle: {
            name: 'Executive Sedan Transfer',
            category: 'Private Transfer',
            transmission: 'Automatic',
            seats: 3,
            doors: 4,
            airConditioning: true,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?w=800'
          },
          price: 85,
          currency: criteria.currency || 'USD',
          pickupLocation: criteria.pickupLocation,
          dropoffLocation: criteria.dropoffLocation,
        }
      ];
    }

    return [
      {
        id: `ct-car-${Date.now()}`,
        provider: this.name,
        vendorName: 'Hertz',
        vehicle: {
          name: 'Toyota Corolla or similar',
          category: 'Compact',
          transmission: 'Automatic',
          seats: 5,
          doors: 4,
          airConditioning: true,
          image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
        },
        price: 150,
        currency: criteria.currency || 'USD',
        pickupLocation: criteria.pickupLocation,
        dropoffLocation: criteria.dropoffLocation,
      },
      {
        id: `ct-car-${Date.now() + 1}`,
        provider: this.name,
        vendorName: 'Avis',
        vehicle: {
          name: 'Luxury SUV (Prado / Land Cruiser)',
          category: 'SUV',
          transmission: 'Automatic',
          seats: 7,
          doors: 4,
          airConditioning: true,
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
        },
        price: 320,
        currency: criteria.currency || 'USD',
        pickupLocation: criteria.pickupLocation,
        dropoffLocation: criteria.dropoffLocation,
      }
    ];
  }
}
