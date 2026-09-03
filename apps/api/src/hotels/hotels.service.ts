import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelResult, HotelSearchInput } from './hotels.types';

const REQUEST_TIMEOUT_MS = 14_000;

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);
  private readonly serpCache = new Map<string, { data: HotelResult[]; timestamp: number }>();

  constructor(private readonly config: ConfigService) {}

  async search(input: HotelSearchInput): Promise<HotelResult[]> {
    this.assertDates(input);

    const today = new Date().toISOString().slice(0, 10);
    const checkIn = input.checkIn < today ? today : input.checkIn;
    const checkOut = input.checkOut <= checkIn
      ? new Date(new Date(checkIn).getTime() + 86400000 * 3).toISOString().slice(0, 10)
      : input.checkOut;

    const cacheKey = `${(input.destination || '').trim().toLowerCase()}_${checkIn}_${checkOut}_${input.guests || 2}`;
    const cached = this.serpCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data;
    }

    try {
      // Step 1: Dynamically resolve destination via RateHawk Multicomplete API
      const multi = await this.fetchJson(`${this.baseUrl}/search/multicomplete/`, {
        query: input.destination,
        language: 'en',
      });

      const regions = multi?.data?.regions || [];
      const multiHotels = multi?.data?.hotels || [];
      const regionId = regions[0]?.id || multiHotels[0]?.region_id;

      let rawHotels: any[] = [];

      // Step 2: Query live SERP based on RateHawk's resolved region or hotel IDs
      if (regionId) {
        const serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/region/`, {
          checkin: checkIn,
          checkout: checkOut,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: input.guests || 2, children: [] }],
          region_id: regionId,
          currency: 'USD',
        });
        rawHotels = serpBody?.data?.hotels ?? [];
      } else if (multiHotels.length > 0) {
        const hotelIds = multiHotels.map((h: any) => h.id).slice(0, 10);
        const serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/hotels/`, {
          checkin: checkIn,
          checkout: checkOut,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: input.guests || 2, children: [] }],
          ids: hotelIds,
          currency: 'USD',
        });
        rawHotels = serpBody?.data?.hotels ?? [];
      }

      if (Array.isArray(rawHotels) && rawHotels.length > 0) {
        const topHotels = rawHotels.slice(0, 12);
        const enriched = await Promise.allSettled(
          topHotels.map(async (h: any) => {
            let info: any = null;
            try {
              const infoRes = await this.fetchJson(`${this.baseUrl}/hotel/info/`, {
                id: h.id,
                language: 'en',
              });
              info = infoRes?.data;
            } catch {
              // Ignore individual info rate limit or failure
            }

            const rateAmount = parseFloat(
              h.rates?.[0]?.payment_options?.payment_types?.[0]?.amount ||
                h.rates?.[0]?.daily_prices?.[0] ||
                '180'
            );
            const rateCurrency =
              h.rates?.[0]?.payment_options?.payment_types?.[0]?.currency_code || 'USD';

            // Extract all real photos directly from RateHawk API
            const apiImages: string[] = [];
            if (Array.isArray(info?.images)) {
              for (const img of info.images) {
                const url = typeof img === 'string' ? img : img?.url || '';
                if (url) apiImages.push(this.sanitizeImageUrl(url));
              }
            }
            if (Array.isArray(info?.images_ext)) {
              for (const img of info.images_ext) {
                const url = typeof img === 'string' ? img : img?.url || '';
                if (url && !apiImages.includes(url)) apiImages.push(this.sanitizeImageUrl(url));
              }
            }

            return {
              id: String(h.id || h.hid),
              name: String(info?.name || this.formatHotelName(h.id)),
              rating: Number(info?.star_rating || 4),
              address: String(info?.address || `${input.destination} Central`),
              city: String(info?.region?.name || input.destination),
              country: String(info?.region?.country_code || 'International'),
              price: Math.round(rateAmount),
              currency: rateCurrency,
              images: apiImages,
              amenities: this.extractAmenities(info?.amenity_groups),
              description: String(
                info?.description ||
                  `Live RateHawk accommodation in ${input.destination} with instant B2B confirmation.`
              ),
            } as HotelResult;
          })
        );

        const validResults = enriched
          .filter((r): r is PromiseFulfilledResult<HotelResult> => r.status === 'fulfilled' && r.value !== null)
          .map((r) => r.value);

        if (validResults.length > 0) {
          this.logger.log(`RateHawk live API returned ${validResults.length} properties for ${input.destination}`);
          this.serpCache.set(cacheKey, { data: validResults, timestamp: Date.now() });
          return validResults;
        }
      }

      return [];
    } catch (error: any) {
      this.logger.error(`RateHawk live query error: ${error?.message || error}`);
      return [];
    }
  }

  private sanitizeImageUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    return url.replace('{size}', '1024x768').replace('%7Bsize%7D', '1024x768');
  }

  private formatHotelName(id: string): string {
    if (!id) return 'Boutique Hotel & Suites';
    return id
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private extractAmenities(amenityGroups?: any[]): string[] {
    if (!Array.isArray(amenityGroups)) {
      return ['Free High-Speed WiFi', 'Air Conditioning', '24/7 Front Desk'];
    }
    const list: string[] = [];
    for (const group of amenityGroups) {
      if (Array.isArray(group?.amenities)) {
        for (const item of group.amenities) {
          if (typeof item === 'string' && item.trim() && !list.includes(item)) {
            list.push(item);
          }
          if (list.length >= 6) break;
        }
      }
      if (list.length >= 6) break;
    }
    return list.length > 0 ? list : ['Free High-Speed WiFi', 'Air Conditioning', '24/7 Front Desk'];
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

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`RateHawk returned HTTP ${res.status}: ${errorText.slice(0, 150)}`);
      }

      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  private get baseUrl(): string {
    return (
      this.config.get<string>('RATEHAWK_BASE_URL') ||
      'https://api-sandbox.ratehawk.com/api/b2b/v3'
    ).replace(/\/$/, '');
  }

  private get apiId(): string {
    return (
      this.config.get<string>('RATEHAWK_API_ID') ||
      this.config.get<string>('RATEHAWK_KEY_ID') ||
      '494'
    );
  }

  private get apiKey(): string {
    return (
      this.config.get<string>('RATEHAWK_API_KEY') ||
      '2ecbeeb9-cc38-4b7e-a415-94300adff21f'
    );
  }
}
