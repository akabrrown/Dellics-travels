import {
  BadRequestException,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { BookHotelDto } from './dto/book-hotel.dto';
import { HotelResult, HotelRoomRate, HotelSearchInput } from './hotels.types';
import { CacheService } from '../cache/cache.service';
import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';
import { HotelbedsProvider } from '../providers/hotels/hotelbeds/hotelbeds.provider';
import { ExpediaProvider } from '../providers/hotels/expedia/expedia.provider';
import { NormalizedHotelWithRates, HotelSearchCriteria } from '../providers/hotels/interfaces/hotel.types';

const REQUEST_TIMEOUT_MS = 14_000;
const HOTEL_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes



@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);
  private readonly cache: CacheService;
  private readonly providers: any[];

  constructor(
    private readonly config: ConfigService,
    private readonly rateHawkProvider: RateHawkProvider,
    private readonly hotelbedsProvider: HotelbedsProvider,
    private readonly expediaProvider: ExpediaProvider,
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache =
      injectedCache ||
      new CacheService({ maxEntries: 500, defaultTtlMs: HOTEL_CACHE_TTL_MS });
    
    // Register active providers
    this.providers = [this.rateHawkProvider, this.hotelbedsProvider, this.expediaProvider];
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
        this.logger.warn(`${provider.name} Fetch Error: ${e.message}`);
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
    const markupValue = await this.getMarkupPercentage();
    const finalOffers = this.applyMarkup(ranked, markupValue);

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
  private applyMarkup(offers: HotelResult[], markupPercentage: number): HotelResult[] {
    return offers.map(offer => {
      offer.price = Math.ceil(offer.price * (1 + markupPercentage));
      offer.rates = offer.rates.map(rate => ({
        ...rate,
        price: Math.ceil(rate.price * (1 + markupPercentage))
      }));
      return offer;
    });
  }

  
  
  /**
   * Hotel Booking Initialization
   */
  async createBooking(dto: BookHotelDto) {
    const provider = this.providers.find(p => p.name.toLowerCase() === dto.provider.toLowerCase());
    if (!provider) {
      throw new BadRequestException(`Provider ${dto.provider} not found`);
    }

    // 1. Verify Rate hasn't changed (OTA pre-book)
    const isRateValid = await provider.verifyRate(dto.rateId).catch(() => false);
    if (!isRateValid) {
       throw new BadRequestException('The selected rate is no longer available. Please search again.');
    }

    // 2. Create OTABooking Record (PENDING)
    const dellics_reference = `HTL-${Date.now()}`;
    const booking = await this.prisma.oTABooking.create({
      data: {
        dellics_reference,
        customer_name: `${dto.guests[0].firstName} ${dto.guests[0].lastName}`,
        customer_email: dto.contactDetails.email,
        customer_phone: dto.contactDetails.phone || '',
        total_amount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'PAYMENT_PENDING',
        items: {
          create: {
            provider_name: dto.provider,
            provider_type: 'HOTEL',
            item_details: JSON.parse(JSON.stringify(dto)),
            base_price: dto.amount, // Needs precise calculation if we separate base/markup at this stage
            markup_applied: 0, 
            final_price: dto.amount,
            currency: dto.currency || 'USD',
          }
        }
      }
    });

    // 3. Initialize Paystack Transaction
    const payment = await this.paymentsService.initializePaystack({
      email: dto.contactDetails.email,
      amount: dto.amount,
      currency: dto.currency || 'USD',
      reference: `PAY_${booking.id}`,
      metadata: {
        bookingId: booking.id,
        type: 'HOTEL',
      }
    });

    // Update with Paystack reference
    await this.prisma.oTABooking.update({
      where: { id: booking.id },
      data: { paystack_reference: payment.reference }
    });

    return {
      success: true,
      bookingId: booking.id,
      paymentUrl: payment.authorizationUrl,
      reference: payment.reference,
    };
  }

  
  async finalizeOTABooking(bookingId: string) {
    this.logger.log(`Finalizing OTA Booking ${bookingId}`);
    const booking = await this.prisma.oTABooking.findUnique({
      where: { id: bookingId },
      include: { items: true }
    });

    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.status === 'CONFIRMED') return booking; // Already confirmed
    
    // Update to payment success first
    await this.prisma.oTABooking.update({
      where: { id: bookingId },
      data: { status: 'PAYMENT_SUCCESS' }
    });

    // We only have one item for hotels currently
    const item = booking.items[0];
    const details = item.item_details as any;

    const provider = this.providers.find(p => p.name.toLowerCase() === item.provider_name.toLowerCase());
    if (!provider) {
      this.logger.error(`Provider ${item.provider_name} not found for booking ${bookingId}`);
      await this.prisma.oTABooking.update({ where: { id: bookingId }, data: { status: 'FAILED' }});
      return;
    }

    try {
      const response = await provider.book({
        rateId: details.rateId,
        guests: details.guests,
        contactDetails: details.contactDetails,
      });

      if (response.success) {
        await this.prisma.oTABooking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' }
        });
        
        await this.prisma.oTABookingItem.update({
          where: { id: item.id },
          data: { supplier_reference: response.bookingId, supplier_status: response.status }
        });
        
        this.logger.log(`Successfully confirmed booking ${bookingId} with provider ${provider.name}`);
      } else {
        throw new Error(response.error || 'Provider booking failed');
      }
    } catch (e) {
      this.logger.error(`Provider booking failed for ${bookingId}`, e);
      await this.prisma.oTABooking.update({ where: { id: bookingId }, data: { status: 'FAILED' }});
      // In a real system, we'd trigger a manual refund or retry queue here.
    }
  }

  private async getMarkupPercentage(): Promise<number> {
    const cacheKey = 'markup:hotels:global';
    const cached = this.cache.get<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      // Find the active global or hotel specific markup rule
      const rule = await this.prisma.markupRule.findFirst({
        where: {
          isActive: true,
          // You could add providerType: 'HOTEL' if you added that enum value, 
          // but assuming a global default for now or finding by name.
        },
        orderBy: { created_at: 'desc' }
      });
      
      // Default to 12% if no rule is found
      const markup = rule ? Number(rule.value) / 100 : 0.12;
      this.cache.set(cacheKey, markup, 5 * 60 * 1000); // 5 mins cache
      return markup;
    } catch (e) {
      this.logger.error('Failed to fetch markup from DB, using fallback', e);
      return 0.12;
    }
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
