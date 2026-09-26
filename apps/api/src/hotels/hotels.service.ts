import {
  BadRequestException,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelResult, HotelRoomRate, HotelSearchInput } from './hotels.types';
import { CacheService } from '../cache/cache.service';

const REQUEST_TIMEOUT_MS = 14_000;
const HOTEL_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Dellics Markup Configuration
const DELLICS_MARKUP_PERCENTAGE = 0.12; // 12% markup

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);
  private readonly cache: CacheService;

  constructor(
    private readonly config: ConfigService,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache =
      injectedCache ||
      new CacheService({ maxEntries: 500, defaultTtlMs: HOTEL_CACHE_TTL_MS });
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

    const cacheKey = `hotels:aggregated:${(input.destination || '').trim().toLowerCase()}:${checkIn}:${checkOut}:${input.adults || 2}:${input.rooms || 1}`;
    const cached = this.cache.get<HotelResult[]>(cacheKey);
    if (cached) {
      this.logger.debug(`[Cache HIT] Serving aggregated hotel SERP for key: ${cacheKey}`);
      return cached;
    }

    this.logger.log(`[Aggregation Engine] Starting parallel fetch for ${input.destination}`);

    // 1. Parallel Fetching
    const [rateHawkOffers, hotelBedsOffers, expediaOffers] = await Promise.all([
      this.fetchFromRateHawk(sanitizedInput).catch((e) => {
        this.logger.warn(`RateHawk Fetch Error: ${e.message}`);
        return [];
      }),
      this.fetchFromHotelbeds(sanitizedInput).catch((e) => {
        this.logger.warn(`Hotelbeds Fetch Error: ${e.message}`);
        return [];
      }),
      this.fetchFromExpedia(sanitizedInput).catch((e) => {
        this.logger.warn(`Expedia Fetch Error: ${e.message}`);
        return [];
      }),
    ]);

    // 2. Normalization (Already handled by the fetchers mapping to HotelResult)
    const allOffers = [...rateHawkOffers, ...hotelBedsOffers, ...expediaOffers];
    
    if (allOffers.length === 0) {
       return [];
    }

    // 3. Duplicate Removal / Mapping (Merge rates for same hotels)
    const deduplicated = this.removeDuplicates(allOffers);

    // 4. Price & Terms Comparison
    const ranked = this.compareAndRank(deduplicated);

    // 5. Dellics Markup Engine
    const finalOffers = this.applyMarkup(ranked);

    this.cache.set(cacheKey, finalOffers, HOTEL_CACHE_TTL_MS);
    return finalOffers;
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
      const matchKey = `${normName}_${normCity}`;

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

  // =====================================================================
  // PROVIDER FETCHERS (API Layer)
  // =====================================================================

  private async fetchFromRateHawk(input: HotelSearchInput): Promise<HotelResult[]> {
    const adultsCount = input.adults || input.guests || 2;
    const childrenCount = input.children || 0;
    const childrenAges = Array.from({ length: childrenCount }, () => 7);

    const searchDest = (input.destination || '').trim();
    const cleanCity = searchDest.split(',')[0].trim();

    const multi = await this.fetchJson(`${this.baseUrl}/search/multicomplete/`, {
      query: cleanCity || searchDest,
      language: 'en',
    }).catch(() => null);

    const regions = multi?.data?.regions || [];
    const multiHotels = multi?.data?.hotels || [];
    
    // Sandbox fallback regions
    const isSandbox = (this.baseUrl || '').includes('sandbox');
    let regionId = regions[0]?.id || multiHotels[0]?.region_id;
    if (!regionId && isSandbox) {
        if (searchDest.toLowerCase().includes('dubai')) regionId = 6053839;
        else if (searchDest.toLowerCase().includes('paris')) regionId = 2734;
    }

    let rawHotels: any[] = [];

    if (regionId) {
      const serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/region/`, {
        checkin: input.checkIn,
        checkout: input.checkOut,
        residency: 'gb',
        language: 'en',
        guests: [{ adults: adultsCount, children: childrenAges }],
        region_id: regionId,
        currency: 'USD',
      });
      rawHotels = serpBody?.data?.hotels ?? [];
    }

    if (isSandbox) {
      try {
        const testSerp = await this.fetchJson(`${this.baseUrl}/search/serp/hotels/`, {
          checkin: input.checkIn,
          checkout: input.checkOut,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: adultsCount, children: childrenAges }],
          ids: ['10004834', '8819557'],
          currency: 'USD',
        });
        const testHotels = testSerp?.data?.hotels || [];
        const existingIds = new Set(rawHotels.map((h: any) => h.id));
        const filteredTestHotels = testHotels.filter((h: any) => !existingIds.has(h.id));
        rawHotels = [...filteredTestHotels, ...rawHotels];
      } catch (e: any) {
        this.logger.warn('Failed to fetch RateHawk test hotels: ' + e.message);
      }
    }

    if (Array.isArray(rawHotels) && rawHotels.length > 0) {
      const topHotels = rawHotels.slice(0, 10);
      const enriched = await Promise.allSettled(
        topHotels.map(async (h: any) => {
          let info: any = null;
          try {
            const infoRes = await this.fetchJson(`${this.baseUrl}/hotel/info/`, { id: h.id, language: 'en' });
            info = infoRes?.data;
          } catch {}

          const liveRates: HotelRoomRate[] = (h.rates || []).map((r: any) => ({
            matchHash: r.match_hash || '',
            roomName: r.room_data_trans?.main_name || r.room_name || 'Standard Room',
            meal: r.meal === 'breakfast' ? 'Breakfast Included' : r.meal === 'all-inclusive' ? 'All Inclusive' : 'Room Only',
            price: Math.round(parseFloat(r.payment_options?.payment_types?.[0]?.amount || r.daily_prices?.[0] || '180')),
            currency: r.payment_options?.payment_types?.[0]?.currency_code || 'USD',
            freeCancellationBefore: r.payment_options?.payment_types?.[0]?.cancellation_penalties?.free_cancellation_before || undefined,
            beddingType: r.room_data_trans?.bedding_type || r.amenities_data?.[0] || '1 Double Bed',
            amenities: Array.isArray(r.amenities_data) ? r.amenities_data : [],
          }));

          const apiImages: string[] = [];
          if (Array.isArray(info?.images)) {
             info.images.forEach((img: any) => {
                const url = typeof img === 'string' ? img : img?.url || '';
                if (url) apiImages.push(this.sanitizeImageUrl(url));
             });
          }

          const baseRateAmount = parseFloat(h.rates?.[0]?.payment_options?.payment_types?.[0]?.amount || h.rates?.[0]?.daily_prices?.[0] || '180');

          return {
            id: String(h.id || h.hid),
            name: String(info?.name || this.formatHotelName(h.id)),
            rating: Number(info?.star_rating || 4),
            address: String(info?.address || `${input.destination} Central`),
            city: String(info?.region?.name || input.destination),
            country: String(info?.region?.country_code || 'International'),
            price: Math.round(baseRateAmount),
            currency: 'USD',
            images: apiImages,
            amenities: this.extractAmenities(info?.amenity_groups),
            description: String(info?.description || `Premium accommodation in ${input.destination}.`),
            rates: liveRates,
          } as HotelResult;
        })
      );

      return enriched
        .filter((r): r is PromiseFulfilledResult<HotelResult> => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value);
    }
    return [];
  }

  private async fetchFromHotelbeds(input: HotelSearchInput): Promise<HotelResult[]> {
    // TODO: Implement actual Hotelbeds Apitude XML/JSON integration
    // For now, this returns mock data structurally identical to the pipeline
    if (input.destination.toLowerCase().includes('dubai')) {
       return [{
         id: 'hb-1001',
         name: 'Atlantis The Palm',
         rating: 5,
         address: 'Crescent Road, The Palm Jumeirah',
         city: 'Dubai',
         country: 'AE',
         price: 520, // Net rate before markup
         currency: 'USD',
         images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
         amenities: ['Private Beach', 'Waterpark Access', 'Spa'],
         description: 'Iconic resort on the Palm Jumeirah.',
         rates: [
           {
             matchHash: 'hb-rate-1',
             roomName: 'Ocean King Room',
             meal: 'Breakfast Included',
             price: 520,
             currency: 'USD',
             freeCancellationBefore: '2026-10-01',
             beddingType: '1 King Bed',
             amenities: ['Ocean View', 'Balcony']
           }
         ]
       }];
    }
    return [];
  }

  private async fetchFromExpedia(input: HotelSearchInput): Promise<HotelResult[]> {
    // TODO: Implement actual Expedia EPS Rapid integration
    return [];
  }

  // =====================================================================
  // UTILITIES
  // =====================================================================

  private sanitizeImageUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    return url.replace('{size}', '1024x768').replace('%7Bsize%7D', '1024x768');
  }

  private formatHotelName(id: string): string {
    if (!id) return 'Boutique Hotel';
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  private extractAmenities(amenityGroups?: any[]): string[] {
    if (!Array.isArray(amenityGroups)) return ['Free WiFi', 'Air Conditioning'];
    const list: string[] = [];
    for (const group of amenityGroups) {
      if (Array.isArray(group?.amenities)) {
        for (const item of group.amenities) {
          if (typeof item === 'string' && item.trim() && !list.includes(item)) list.push(item);
          if (list.length >= 5) break;
        }
      }
      if (list.length >= 5) break;
    }
    return list.length > 0 ? list : ['Free WiFi', 'Air Conditioning'];
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

  private async fetchJson(url: string, payload: unknown): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const basicAuth = Buffer.from(`${this.apiId}:${this.apiKey}`).toString('base64');

    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
          'X-API-ID': this.apiId,
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  private get baseUrl(): string {
    let url = (this.config.get<string>('RATEHAWK_BASE_URL') || 'https://api-sandbox.ratehawk.com/api/b2b/v3').trim().replace(/\/$/, '');
    if (!url.includes('/api/b2b/v3')) {
      url += '/api/b2b/v3';
    }
    return url;
  }

  private get apiId(): string {
    return this.config.get<string>('RATEHAWK_KEY_ID') || this.config.get<string>('RATEHAWK_API_ID') || '494';
  }

  private get apiKey(): string {
    return this.config.get<string>('RATEHAWK_API_KEY') || '2ecbeeb9-cc38-4b7e-a415-94300adff21f';
  }
}
