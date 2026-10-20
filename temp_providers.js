const fs = require('fs');

const hotelbedsProviderCode = `import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(\`Searching Hotelbeds for destination: \${criteria.destination}\`);
    
    // Sandbox / Mock Implementation
    if (criteria.destination.toLowerCase().includes('dubai')) {
       return [{
         hotelId: 'hb-1001',
         provider: this.name,
         name: 'Atlantis The Palm',
         rating: 5,
         location: {
           address: 'Crescent Road, The Palm Jumeirah',
           city: 'Dubai',
           country: 'AE'
         },
         description: 'Iconic resort on the Palm Jumeirah.',
         images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
         amenities: ['Private Beach', 'Waterpark Access', 'Spa'],
         rates: [
           {
             rateId: 'hb-rate-1',
             roomName: 'Ocean King Room',
             boardType: 'Breakfast Included',
             price: 520,
             currency: 'USD',
             supplier: this.name,
             cancellationPolicy: {
               isRefundable: true,
               freeCancellationUntil: '2026-10-01'
             }
           }
         ]
       }];
    }
    return [];
  }

  async verifyRate(rateId: string): Promise<boolean> {
    this.logger.log(\`Verifying Hotelbeds rate: \${rateId}\`);
    return true; // Mock success
  }

  async book(request: HotelBookingRequest): Promise<HotelBookingResponse> {
    this.logger.log(\`Booking Hotelbeds rate: \${request.rateId}\`);
    return {
      success: true,
      bookingId: \`HB-BK-\${Date.now()}\`,
      status: 'CONFIRMED'
    };
  }

  async getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]> {
    return [];
  }
}
`;

const expediaProviderCode = `import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(\`Searching Expedia (EPS Rapid) for destination: \${criteria.destination}\`);
    // Placeholder implementation
    return [];
  }

  async verifyRate(rateId: string): Promise<boolean> {
    this.logger.log(\`Verifying Expedia rate: \${rateId}\`);
    return true; 
  }

  async book(request: HotelBookingRequest): Promise<HotelBookingResponse> {
    this.logger.log(\`Booking Expedia rate: \${request.rateId}\`);
    return {
      success: true,
      bookingId: \`EXP-BK-\${Date.now()}\`,
      status: 'CONFIRMED'
    };
  }

  async getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]> {
    return [];
  }
}
`;

fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/providers/hotels/hotelbeds/hotelbeds.provider.ts', hotelbedsProviderCode);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/providers/hotels/expedia/expedia.provider.ts', expediaProviderCode);

const modulePath = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.module.ts';
let moduleContent = fs.readFileSync(modulePath, 'utf8');
moduleContent = moduleContent.replace(
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';",
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';\nimport { HotelbedsProvider } from '../providers/hotels/hotelbeds/hotelbeds.provider';\nimport { ExpediaProvider } from '../providers/hotels/expedia/expedia.provider';"
);
moduleContent = moduleContent.replace(
  "providers: [HotelsService, RateHawkProvider]",
  "providers: [HotelsService, RateHawkProvider, HotelbedsProvider, ExpediaProvider]"
);
fs.writeFileSync(modulePath, moduleContent);

const servicePath = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let serviceContent = fs.readFileSync(servicePath, 'utf8');
serviceContent = serviceContent.replace(
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';",
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';\nimport { HotelbedsProvider } from '../providers/hotels/hotelbeds/hotelbeds.provider';\nimport { ExpediaProvider } from '../providers/hotels/expedia/expedia.provider';"
);
serviceContent = serviceContent.replace(
  "private readonly rateHawkProvider: RateHawkProvider,",
  "private readonly rateHawkProvider: RateHawkProvider,\n    private readonly hotelbedsProvider: HotelbedsProvider,\n    private readonly expediaProvider: ExpediaProvider,"
);
serviceContent = serviceContent.replace(
  "this.providers = [this.rateHawkProvider];",
  "this.providers = [this.rateHawkProvider, this.hotelbedsProvider, this.expediaProvider];"
);
fs.writeFileSync(servicePath, serviceContent);

console.log('Successfully setup additional providers');
