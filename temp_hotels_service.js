const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let content = fs.readFileSync(path, 'utf8');

const newContent = `import {
  BadRequestException,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelResult, HotelRoomRate, HotelSearchInput } from './hotels.types';
import { CacheService } from '../cache/cache.service';
import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';
import { NormalizedHotelWithRates, HotelSearchCriteria } from '../providers/hotels/interfaces/hotel.types';

const REQUEST_TIMEOUT_MS = 14_000;
const HOTEL_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Dellics Markup Configuration
const DELLICS_MARKUP_PERCENTAGE = 0.12; // 12% markup

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);
  private readonly cache: CacheService;
  private readonly providers: any[];

  constructor(
    private readonly config: ConfigService,
    private readonly rateHawkProvider: RateHawkProvider,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache =
      injectedCache ||
      new CacheService({ maxEntries: 500, defaultTtlMs: HOTEL_CACHE_TTL_MS });
    
    // Register active providers
    this.providers = [this.rateHawkProvider];
  }

  /**
   * DELLICS OTA HOTEL AGGREGATION ENGINE
   * Workflow: Parallel Fetch -> Normalize -> Deduplicate -> Compare -> Markup
   */
  async search(input: HotelSearchInput): Promise<HotelResult[]> {
    this.assertDates(input);

    const today = new Date().toISOString().slice(0, 10);
    const checkIn = input.checkIn < today ? today : input.checkIn;
    const checkOut =
      input.checkOut <= checkIn
        ? new Date(new Date(checkIn).getTime() + 86400000 * 3).toISOString().slice(0, 10)
        : input.checkOut;
        
    const sanitizedInput = { ...input, checkIn, checkOut };

    const cacheKey = \`hotels:aggregated:\${(input.destination || '').trim().toLowerCase()}:\${checkIn}:\${checkOut}:\${input.adults || 2}:\${input.rooms || 1}\`;
    const cached = this.cache.get<HotelResult[]>(cacheKey);
    if (cached) {
      this.logger.debug(\`[Cache HIT] Serving aggregated hotel SERP for key: \${cacheKey}\`);
      return cached;
    }

    this.logger.log(\`[Aggregation Engine] Starting parallel fetch for \${input.destination}\`);

    const criteria: HotelSearchCriteria = {
      destination: input.destination,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: [{ adults: input.adults || input.guests || 2, children: input.children || 0 }],
      currency: 'USD',
    };

    // 1. Parallel Fetching from all providers
    const providerPromises = this.providers.map(provider => 
      provider.search(criteria).catch((e: Error) => {
        this.logger.warn(\`\${provider.name} Fetch Error: \${e.message}\`);
        return [];
      })
    );

    const resultsArray = await Promise.all(providerPromises);
    const allNormalizedOffers = resultsArray.flat();
    
    if (allNormalizedOffers.length === 0) {
       return [];
    }

    // Map NormalizedHotelWithRates to frontend HotelResult format
    const allOffers = allNormalizedOffers.map(offer => this.mapToHotelResult(offer));

    // 3. Duplicate Removal / Mapping (Merge rates for same hotels)
    const deduplicated = this.removeDuplicates(allOffers);

    // 4. Price & Terms Comparison
    const ranked = this.compareAndRank(deduplicated);

    // 5. Dellics Markup Engine
    const finalOffers = this.applyMarkup(ranked);

    this.cache.set(cacheKey, finalOffers, HOTEL_CACHE_TTL_MS);
    return finalOffers;
  }

  private mapToHotelResult(normalized: NormalizedHotelWithRates): HotelResult {
    return {
      id: normalized.hotelId,
      name: normalized.name,
      rating: normalized.rating,
      address: normalized.location.address,
      city: normalized.location.city,
      country: normalized.location.country,
      price: normalized.rates.length > 0 ? normalized.rates[0].price : 0,
      currency: normalized.rates.length > 0 ? normalized.rates[0].currency : 'USD',
      images: normalized.images,
      amenities: normalized.amenities,
      description: normalized.description,
      rates: normalized.rates.map(r => ({
        matchHash: r.rateId,
        roomName: r.roomName,
        meal: r.boardType,
        price: r.price,
        currency: r.currency,
        freeCancellationBefore: r.cancellationPolicy?.freeCancellationUntil,
        beddingType: 'Standard', // Not normalized yet
        amenities: [],
      })),
    };
  }

  /**
   * Duplicate Removal Engine
   * Merges identical hotels from different providers and pools their room rates together.
   */
  private removeDuplicates(offers: HotelResult[]): HotelResult[] {
    const hotelMap = new Map<string, HotelResult>();

    for (const offer of offers) {
      // Create a normalization key based on name and city to detect duplicates across providers
      const normName = offer.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normCity = (offer.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchKey = \`\${normName}_\${normCity}\`;

      if (hotelMap.has(matchKey)) {
        // Merge rates if hotel already exists
        const existing = hotelMap.get(matchKey)!;
        existing.rates.push(...offer.rates);
        // Take the highest rating available
        existing.rating = Math.max(existing.rating, offer.rating);
        // Merge images
        existing.images = Array.from(new Set([...existing.images, ...offer.images]));
      } else {
        hotelMap.set(matchKey, { ...offer });
      }
    }

    return Array.from(hotelMap.values());
  }

  /**
   * Price & Terms Comparison
   * Ranks room rates within each hotel, and ranks hotels overall.
   */
  private compareAndRank(offers: HotelResult[]): HotelResult[] {
    for (const offer of offers) {
      // Sort rates internally: Cheapest first, prioritizing Free Cancellation
      offer.rates.sort((a, b) => {
        if (a.price === b.price) {
           // If same price, prefer the one with free cancellation
           if (a.freeCancellationBefore && !b.freeCancellationBefore) return -1;
           if (!a.freeCancellationBefore && b.freeCancellationBefore) return 1;
           return 0;
        }
        return a.price - b.price;
      });
      
      // Set the base hotel price to the best available rate
      if (offer.rates.length > 0) {
        offer.price = offer.rates[0].price;
      }
    }

    // Rank hotels overall: Lowest price first, then higher rating
    return offers.sort((a, b) => {
      if (a.price === b.price) {
        return b.rating - a.rating;
      }
      return a.price - b.price;
    });
  }

  /**
   * Dellics Markup Engine
   * Applies the fixed profit margin to the normalized net rates.
   */
  private applyMarkup(offers: HotelResult[]): HotelResult[] {
    return offers.map(offer => {
      offer.price = Math.ceil(offer.price * (1 + DELLICS_MARKUP_PERCENTAGE));
      offer.rates = offer.rates.map(rate => ({
        ...rate,
        price: Math.ceil(rate.price * (1 + DELLICS_MARKUP_PERCENTAGE))
      }));
      return offer;
    });
  }

  private assertDates(input: HotelSearchInput): void {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    if (!input.checkIn || input.checkIn < twoDaysAgo) {
      throw new BadRequestException('checkIn date must be today or in the future');
    }
    if (!input.checkOut || input.checkOut <= input.checkIn) {
      throw new BadRequestException('checkOut date must be after checkIn date');
    }
  }
}
`;

fs.writeFileSync(path, newContent);
console.log('Successfully updated hotels.service.ts');
