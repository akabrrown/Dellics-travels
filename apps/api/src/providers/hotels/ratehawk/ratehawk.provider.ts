import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IHotelProvider } from '../interfaces/hotel-provider.interface';
import {
  HotelSearchCriteria,
  NormalizedHotelWithRates,
  HotelBookingRequest,
  HotelBookingResponse,
  NormalizedHotel,
  NormalizedRoomRate,
} from '../interfaces/hotel.types';

const REQUEST_TIMEOUT_MS = 14_000;

@Injectable()
export class RateHawkProvider implements IHotelProvider {
  public readonly name = 'ratehawk';
  private readonly logger = new Logger(RateHawkProvider.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async search(criteria: HotelSearchCriteria): Promise<NormalizedHotelWithRates[]> {
    this.logger.log(`Searching RateHawk for destination: ${criteria.destination}`);
    
    let adultsCount = 2;
    let childrenCount = 0;
    let childrenAges: number[] = [];

    if (criteria.guests && criteria.guests.length > 0) {
      adultsCount = criteria.guests[0].adults || 2;
      childrenCount = criteria.guests[0].children || 0;
      childrenAges = criteria.guests[0].childrenAges || Array.from({ length: childrenCount }, () => 7);
    }

    const searchDest = (criteria.destination || '').trim();
    const cleanCity = searchDest.split(',')[0].trim();

    const multi = await this.fetchJson(`${this.baseUrl}/search/multicomplete/`, {
      query: cleanCity || searchDest,
      language: 'en',
    }).catch(() => null);

    const regions = multi?.data?.regions || [];
    const multiHotels = multi?.data?.hotels || [];
    
    const isSandbox = (this.baseUrl || '').includes('sandbox');
    let regionId = regions[0]?.id || multiHotels[0]?.region_id;
    if (!regionId && isSandbox) {
        if (searchDest.toLowerCase().includes('dubai')) regionId = 6053839;
        else if (searchDest.toLowerCase().includes('paris')) regionId = 2734;
    }

    let rawHotels: any[] = [];

    if (regionId) {
      const serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/region/`, {
        checkin: criteria.checkInDate,
        checkout: criteria.checkOutDate,
        residency: 'gb',
        language: 'en',
        guests: [{ adults: adultsCount, children: childrenAges }],
        region_id: regionId,
        currency: criteria.currency || 'USD',
      });
      rawHotels = serpBody?.data?.hotels ?? [];
    }

    if (isSandbox) {
      try {
        const testSerp = await this.fetchJson(`${this.baseUrl}/search/serp/hotels/`, {
          checkin: criteria.checkInDate,
          checkout: criteria.checkOutDate,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: adultsCount, children: childrenAges }],
          ids: ['10004834', '8819557'],
          currency: criteria.currency || 'USD',
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
      // Single batch query — no N+1, no live /hotel/info/ calls
      const hotelIds = topHotels.map((h: any) => String(h.id || h.hid));
      const cachedRows = await this.prisma.hotelStaticCache.findMany({
        where: { id: { in: hotelIds } },
      });
      const staticCache = new Map(cachedRows.map((r) => [r.id, r]));

      const enriched = await Promise.allSettled(
        topHotels.map(async (h: any) => {
          const info = staticCache.get(String(h.id || h.hid)) ?? null;

          const liveRates: NormalizedRoomRate[] = (h.rates || []).map((r: any) => {
            const amount = parseFloat(r.payment_options?.payment_types?.[0]?.amount || r.daily_prices?.[0] || '180');
            const ccy = r.payment_options?.payment_types?.[0]?.currency_code || 'USD';
            const fcb = r.payment_options?.payment_types?.[0]?.cancellation_penalties?.free_cancellation_before;

            return {
              rateId: String(r.match_hash || ''),
              roomName: String(r.room_data_trans?.main_name || r.room_name || 'Standard Room'),
              boardType: String(r.meal === 'breakfast' ? 'Breakfast Included' : r.meal === 'all-inclusive' ? 'All Inclusive' : 'Room Only'),
              price: Math.round(amount),
              currency: String(ccy),
              supplier: this.name,
              cancellationPolicy: {
                isRefundable: !!fcb,
                freeCancellationUntil: fcb ? String(fcb) : undefined,
              },
            } as NormalizedRoomRate;
          });

          const apiImages: string[] = [];
          const rawImages = typeof info?.images === 'string'
            ? JSON.parse(info.images || '[]')
            : Array.isArray(info?.images) ? info.images : [];
          for (const url of rawImages) {
            if (url) apiImages.push(this.sanitizeImageUrl(url));
          }

          return {
            hotelId: String(h.id || h.hid),
            provider: this.name,
            name: String(info?.name || this.formatHotelName(String(h.id || h.hid))),
            rating: Number((info as any)?.star_rating || 4),
            description: String((info as any)?.description || `Premium accommodation in ${criteria.destination}.`),
            location: {
              address: String((info as any)?.address || `${criteria.destination} Central`),
              city: String((info as any)?.city || criteria.destination),
              country: String((info as any)?.country_code || 'International'),
            },
            images: apiImages,
            amenities: typeof info?.amenities === 'string'
              ? JSON.parse((info as any).amenities || '[]')
              : this.extractAmenities((info as any)?.amenity_groups),
            rates: liveRates,
          } as NormalizedHotelWithRates;
        })
      );

      return enriched
        .filter((r): r is PromiseFulfilledResult<NormalizedHotelWithRates> => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value);
    }
    return [];
  }

  async verifyRate(rateId: string): Promise<boolean> {
    this.logger.log(`Verifying RateHawk rate: ${rateId}`);
    // Implement actual /hotel/prebook logic when needed
    return true;
  }

  async book(request: HotelBookingRequest): Promise<HotelBookingResponse> {
    this.logger.log(`Booking RateHawk rate: ${request.rateId}`);
    return {
      success: false,
      status: 'FAILED',
      error: 'Not implemented yet',
    };
  }

  async getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]> {
    this.logger.log(`Fetching details for ${hotelIds.length} hotels`);
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
    let url = (this.configService.get<string>('RATEHAWK_BASE_URL') || 'https://api-sandbox.ratehawk.com/api/b2b/v3').trim().replace(/\/$/, '');
    if (!url.includes('/api/b2b/v3')) {
      url += '/api/b2b/v3';
    }
    return url;
  }

  private get apiId(): string {
    let id = this.configService.get<string>('RATEHAWK_KEY_ID');
    if (!id || !/^\d+$/.test(id.trim())) {
      id = this.configService.get<string>('RATEHAWK_API_ID');
    }
    if (!id || !/^\d+$/.test(id.trim())) {
      id = '494';
    }
    return id.trim();
  }

  private get apiKey(): string {
    let key = this.configService.get<string>('RATEHAWK_API_KEY');
    if (!key || key.trim() === '') return '2ecbeeb9-cc38-4b7e-a415-94300adff21f';
    return key.trim();
  }
}
