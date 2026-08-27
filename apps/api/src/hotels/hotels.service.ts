import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelResult, HotelSearchInput } from './hotels.types';

const REQUEST_TIMEOUT_MS = 15_000;

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);

  constructor(private readonly config: ConfigService) {}

  async search(input: HotelSearchInput): Promise<HotelResult[]> {
    this.assertDates(input);
    const body = await this.fetchJson(`${this.baseUrl}/hotels/search`, {
      destination: input.destination,
      check_in: input.checkIn,
      check_out: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
    });
    return this.normalize(body);
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
      'https://api-sandbox.ratehawk.com'
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
        body: JSON.stringify(payload), // credentials never in the body
      });
      if (!res.ok) {
        throw new Error(`Ratehawk responded ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      this.logger.error(`Ratehawk search failed: ${(error as Error).message}`);
      throw new BadGatewayException(
        'Hotel availability is temporarily unavailable. Please try again shortly.',
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private normalize(body: any): HotelResult[] {
    const hotels = body?.hotels;
    if (!Array.isArray(hotels)) return [];
    return hotels.map((h: any) => ({
      id: String(h.id ?? h.hotel_id ?? ''),
      name: String(h.name ?? h.hotel_name ?? 'Unknown hotel'),
      rating: Number(h.rating ?? h.stars ?? 0),
      address: String(h.address ?? h.location ?? ''),
      city: String(h.city ?? ''),
      country: String(h.country ?? ''),
      price: Number(h.price ?? h.min_price ?? 0),
      currency: String(h.currency ?? 'USD'),
      images: this.images(h.images ?? h.photos ?? h.image_url),
      amenities: Array.isArray(h.amenities ?? h.facilities)
        ? (h.amenities ?? h.facilities)
        : [],
      description: String(h.description ?? h.details ?? ''),
    }));
  }

  private images(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .map((img) =>
          typeof img === 'string' ? img : (img?.url ?? img?.path ?? ''),
        )
        .filter(Boolean);
    }
    if (typeof value === 'string') return [value];
    if (value && typeof (value as any).url === 'string')
      return [(value as any).url];
    return [];
  }
}
