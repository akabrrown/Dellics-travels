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

  constructor(private readonly config: ConfigService) {}

  async search(input: HotelSearchInput): Promise<HotelResult[]> {
    this.assertDates(input);

    // 1. Real-time ETG / RateHawk Sandbox v3 call sequence
    try {
      // Step A: Resolve destination / region via RateHawk Multicomplete
      const multi = await this.fetchJson(`${this.baseUrl}/search/multicomplete/`, {
        query: input.destination,
        language: 'en',
      });

      const regionId = multi?.data?.regions?.[0]?.id;
      const hotelIds = (multi?.data?.hotels ?? []).map((h: any) => h.id).slice(0, 10);

      let serpBody: any = null;

      if (regionId) {
        serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/region/`, {
          checkin: input.checkIn,
          checkout: input.checkOut,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: input.guests || 2, children: [] }],
          region_id: regionId,
          currency: 'USD',
        });
      } else if (hotelIds.length > 0) {
        serpBody = await this.fetchJson(`${this.baseUrl}/search/serp/hotels/`, {
          checkin: input.checkIn,
          checkout: input.checkOut,
          residency: 'gb',
          language: 'en',
          guests: [{ adults: input.guests || 2, children: [] }],
          ids: hotelIds,
          currency: 'USD',
        });
      }

      const rawHotels = serpBody?.data?.hotels ?? [];
      if (Array.isArray(rawHotels) && rawHotels.length > 0) {
        // Enrich top live hotels with static details (names, address, photos, amenities)
        const topHotels = rawHotels.slice(0, 12);
        const enriched = await Promise.allSettled(
          topHotels.map(async (h: any) => {
            try {
              const infoRes = await this.fetchJson(`${this.baseUrl}/hotel/info/`, {
                id: h.id,
                language: 'en',
              });
              const info = infoRes?.data;
              const rateAmount = parseFloat(
                h.rates?.[0]?.payment_options?.payment_types?.[0]?.amount ||
                h.rates?.[0]?.daily_prices?.[0] ||
                '0'
              );
              const rateCurrency =
                h.rates?.[0]?.payment_options?.payment_types?.[0]?.currency_code || 'USD';

              const rawImages = (info?.images || []).map((img: any) =>
                this.sanitizeImageUrl(typeof img === 'string' ? img : img?.url || img?.path || '')
              );

              const images = rawImages.filter(Boolean);

              return {
                id: String(h.id || h.hid),
                name: String(info?.name || this.formatHotelName(h.id)),
                rating: Number(info?.star_rating || 0),
                address: String(info?.address || ''),
                city: String(info?.region?.name || input.destination),
                country: String(info?.region?.country_code || ''),
                price: Math.round(rateAmount),
                currency: rateCurrency,
                images: images,
                amenities: this.extractAmenities(info?.amenity_groups),
                description: String(info?.description || ''),
              } as HotelResult;
            } catch {
              return null;
            }
          })
        );

        const validResults = enriched
          .filter((r): r is PromiseFulfilledResult<HotelResult> => r.status === 'fulfilled' && r.value !== null)
          .map((r) => r.value);

        if (validResults.length > 0) {
          this.logger.log(`RateHawk sandbox returned ${validResults.length} live properties`);
          return validResults;
        }
      }
    } catch (error) {
      this.logger.error(
        `RateHawk live query error: ${(error as Error).message}`,
      );
    }

    return [];
  }

  private assertDates(input: HotelSearchInput): void {
    const today = new Date().toISOString().slice(0, 10);
    if (input.checkIn < today) {
      throw new BadRequestException('Check-in date must be today or later.');
    }
    if (input.checkOut <= input.checkIn) {
      throw new BadRequestException('Check-out date must be after check-in.');
    }
  }

  private get baseUrl(): string {
    return (
      this.config.get<string>('RATEHAWK_BASE_URL') ??
      'https://api-sandbox.ratehawk.com/api/b2b/v3'
    );
  }

  /** Isolated so tests can stub transport without hitting the network. */
  protected async fetchJson(path: string, payload: unknown): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const apiId = this.config.get<string>('RATEHAWK_API_ID') ?? '494';
    const apiKey =
      this.config.get<string>('RATEHAWK_API_KEY') ??
      '2ecbeeb9-cc38-4b7e-a415-94300adff21f';
    const basicAuth = Buffer.from(`${apiId}:${apiKey}`).toString('base64');

    try {
      const res = await fetch(path, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
          'X-API-ID': apiId,
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Ratehawk responded ${res.status}`);
      }
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  private sanitizeImageUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    return url.replace('{size}', '1024x768').replace('%7Bsize%7D', '1024x768');
  }

  private formatHotelName(id: string): string {
    if (!id) return 'Boutique Hotel';
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
}
