import { Injectable, Logger, HttpException, HttpStatus, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { HotelsService } from '../hotels/hotels.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly cache: CacheService;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in-memory cache TTL

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly hotelsService: HotelsService,
    @Optional() injectedCache?: CacheService,
  ) {
    this.cache = injectedCache || new CacheService({ maxEntries: 1000, defaultTtlMs: this.CACHE_TTL_MS });
  }

  private getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached !== undefined && cached !== null) {
      this.logger.debug(
        `[Cache HIT] Serving cached flight response for key: ${key}`,
      );
      return cached;
    }
    return null;
  }

  private setCached(key: string, data: any, ttlMs?: number) {
    this.cache.set(key, data, ttlMs ?? this.CACHE_TTL_MS);
  }

  private formatDuration(isoDuration?: string): string {
    if (!isoDuration) return '7h 00m';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return isoDuration;
    const hours = match[1] ? `${match[1]}h` : '0h';
    const mins = match[2] ? ` ${match[2]}m` : '';
    return `${hours}${mins}`.trim();
  }

  async searchFlights(query: any) {
    const origin = (query.origin || 'ACC').toUpperCase().slice(0, 3);
    const destination = (query.destination || 'LHR').toUpperCase().slice(0, 3);
    const cabinClass = (query.cabinClass || 'Economy').toLowerCase();
    const adults = parseInt(query.adults || '1', 10);
    const today = new Date();
    today.setDate(today.getDate() + 30);
    const dateStr = query.date || today.toISOString().split('T')[0];

    const cacheKey = `flights_${origin}_${destination}_${dateStr}_${cabinClass}_${adults}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    // Query FX-Port live GDS flight aggregator API
    const fxPortApiKey =
      this.configService.get<string>('FXPORT_API_KEY') ||
      'fxp_live_503bf984466b274916bb6d3e5ecd527e';
    const fxPortSecret = this.configService.get<string>('FXPORT_WEBHOOK_SECRET');

    if (fxPortApiKey) {
      try {
        const fxHeaders: Record<string, string> = {
          Authorization: `Bearer ${fxPortApiKey}`,
          'X-FXPORT-KEY': fxPortApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
        if (fxPortSecret) {
          fxHeaders['X-Webhook-Secret'] = fxPortSecret;
        }

        const fxPortPayload = {
          origin,
          destination,
          departure_date: dateStr,
          cabin_class: cabinClass,
          passengers: {
            adults: Math.max(1, adults),
            children: parseInt(query.children || '0', 10),
            infants: 0,
          },
        };

        const fxPortResponse = await firstValueFrom(
          this.httpService.post(
            'https://api.fx-port.com/api/v1/get_flights',
            fxPortPayload,
            {
              headers: fxHeaders,
              timeout: 14000,
            },
          ),
        );

        const suppliers = fxPortResponse.data?.suppliers || [];
        const allOffers: any[] = [];
        for (const supplier of suppliers) {
          if (Array.isArray(supplier?.results?.offers)) {
            allOffers.push(...supplier.results.offers);
          }
        }

        if (allOffers.length > 0) {
          const formattedOffers = allOffers.slice(0, 20).map((offer: any) => {
            const itin = offer.itinerary?.[0];
            const firstSeg = itin?.segments?.[0];
            const lastSeg = itin?.segments?.[itin?.segments?.length - 1];
            const price =
              offer.pricing?.basePrice ||
              offer.pricing?.finalPrice ||
              offer.pricing?.b2bPrice ||
              0;
            const currency = offer.pricing?.supplierCurrency || 'USD';
            const airline =
              firstSeg?.flight?.carrierName ||
              offer.validatingAirline?.[0]?.name ||
              'Scheduled Airline';
            const iataCode =
              firstSeg?.flight?.carrierCode ||
              offer.validatingAirline?.[0]?.code ||
              'FL';

            return {
              id: offer.id,
              origin: firstSeg?.departure?.airportCode || origin,
              destination: lastSeg?.arrival?.airportCode || destination,
              price: Math.round(price),
              currency,
              airline,
              iataCode,
              airlineLogo: firstSeg?.flight?.carrierLogoUrl || null,
              departureTime: firstSeg?.departure?.datetime || null,
              arrivalTime: lastSeg?.arrival?.datetime || null,
              duration: this.formatDuration(itin?.duration),
              stops: itin?.stops ?? Math.max(0, (itin?.segments?.length || 1) - 1),
              cabinClass:
                firstSeg?.cabin ||
                cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1),
            };
          });

          const result = {
            status: 'success',
            provider: 'fx-port',
            data: formattedOffers,
          };
          this.setCached(cacheKey, result);
          return result;
        }
      } catch (err: any) {
        this.logger.warn(
          `FX-Port live flight search failed for ${origin}->${destination}: ${err.response?.data?.detail || err.message}`,
        );
      }
    }

    return {
      status: 'success',
      provider: 'fx-port',
      data: [],
    };
  }

  async getExploreData(query: any) {
    const fxPortApiKey =
      this.configService.get<string>('FXPORT_API_KEY') ||
      'fxp_live_503bf984466b274916bb6d3e5ecd527e';

    const origin = (query.origin || 'ACC').toUpperCase().slice(0, 3);
    const interest = (query.interest || 'All').toLowerCase();
    const destParam = query.destination || '';
    const cacheKey = `explore_${origin}_${interest}_${destParam}`;

    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const today = new Date();
    today.setDate(today.getDate() + 30); // 30 days out
    const dateStr = today.toISOString().split('T')[0];

    const date2 = new Date(today);
    date2.setDate(date2.getDate() + 1);
    const date3 = new Date(today);
    date3.setDate(date3.getDate() + 2);
    const dateStrs = [
      dateStr,
      date2.toISOString().split('T')[0],
      date3.toISOString().split('T')[0],
    ];

    // Comprehensive Global Master Destination List (30+ worldwide destinations)
    const globalDestinations = [
      {
        id: '1',
        name: 'London',
        lat: 51.5074,
        lng: -0.1278,
        iata: 'LHR',
        category: 'city',
      },
      {
        id: '2',
        name: 'New York',
        lat: 40.7128,
        lng: -74.006,
        iata: 'JFK',
        category: 'city',
      },
      {
        id: '3',
        name: 'Paris',
        lat: 48.8566,
        lng: 2.3522,
        iata: 'CDG',
        category: 'city',
      },
      {
        id: '4',
        name: 'Dubai',
        lat: 25.2048,
        lng: 55.2708,
        iata: 'DXB',
        category: 'city',
      },
      {
        id: '5',
        name: 'Tokyo',
        lat: 35.6762,
        lng: 139.6503,
        iata: 'HND',
        category: 'city',
      },
      {
        id: '6',
        name: 'Lagos',
        lat: 6.5244,
        lng: 3.3792,
        iata: 'LOS',
        category: 'city',
      },
      {
        id: '7',
        name: 'Abidjan',
        lat: 5.36,
        lng: -4.0083,
        iata: 'ABJ',
        category: 'city',
      },
      {
        id: '8',
        name: 'Johannesburg',
        lat: -26.2041,
        lng: 28.0473,
        iata: 'JNB',
        category: 'city',
      },
      {
        id: '9',
        name: 'Singapore',
        lat: 1.3521,
        lng: 103.8198,
        iata: 'SIN',
        category: 'city',
      },
      {
        id: '10',
        name: 'Sydney',
        lat: -33.8688,
        lng: 151.2093,
        iata: 'SYD',
        category: 'city',
      },
      {
        id: '11',
        name: 'Barcelona',
        lat: 41.3851,
        lng: 2.1734,
        iata: 'BCN',
        category: 'beach',
      },
      {
        id: '12',
        name: 'Miami',
        lat: 25.7617,
        lng: -80.1918,
        iata: 'MIA',
        category: 'beach',
      },
      {
        id: '13',
        name: 'Cancun',
        lat: 21.1619,
        lng: -86.8515,
        iata: 'CUN',
        category: 'beach',
      },
      {
        id: '14',
        name: 'Zanzibar',
        lat: -6.1659,
        lng: 39.2026,
        iata: 'ZNZ',
        category: 'beach',
      },
      {
        id: '15',
        name: 'Honolulu',
        lat: 21.3069,
        lng: -157.8583,
        iata: 'HNL',
        category: 'beach',
      },
      {
        id: '16',
        name: 'Maldives',
        lat: 4.1755,
        lng: 73.5093,
        iata: 'MLE',
        category: 'beach',
      },
      {
        id: '17',
        name: 'Rio de Janeiro',
        lat: -22.9068,
        lng: -43.1729,
        iata: 'GIG',
        category: 'beach',
      },
      {
        id: '18',
        name: 'Nice',
        lat: 43.7102,
        lng: 7.262,
        iata: 'NCE',
        category: 'beach',
      },
      {
        id: '19',
        name: 'Nairobi',
        lat: -1.2921,
        lng: 36.8219,
        iata: 'NBO',
        category: 'nature',
      },
      {
        id: '20',
        name: 'Cape Town',
        lat: -33.9249,
        lng: 18.4241,
        iata: 'CPT',
        category: 'nature',
      },
      {
        id: '21',
        name: 'Reykjavik',
        lat: 64.1466,
        lng: -21.9426,
        iata: 'KEF',
        category: 'nature',
      },
      {
        id: '22',
        name: 'Vancouver',
        lat: 49.2827,
        lng: -123.1207,
        iata: 'YVR',
        category: 'nature',
      },
      {
        id: '23',
        name: 'Auckland',
        lat: -36.8485,
        lng: 174.7633,
        iata: 'AKL',
        category: 'nature',
      },
      {
        id: '24',
        name: 'Geneva',
        lat: 46.2044,
        lng: 6.1432,
        iata: 'GVA',
        category: 'nature',
      },
      {
        id: '25',
        name: 'Rome',
        lat: 41.9028,
        lng: 12.4964,
        iata: 'FCO',
        category: 'culture',
      },
      {
        id: '26',
        name: 'Cairo',
        lat: 30.0444,
        lng: 31.2357,
        iata: 'CAI',
        category: 'culture',
      },
      {
        id: '27',
        name: 'Istanbul',
        lat: 41.0082,
        lng: 28.9784,
        iata: 'IST',
        category: 'culture',
      },
      {
        id: '28',
        name: 'Athens',
        lat: 37.9838,
        lng: 23.7275,
        iata: 'ATH',
        category: 'culture',
      },
      {
        id: '29',
        name: 'Marrakesh',
        lat: 31.6295,
        lng: -7.9811,
        iata: 'RAK',
        category: 'culture',
      },
      {
        id: '30',
        name: 'Amsterdam',
        lat: 52.3676,
        lng: 4.9041,
        iata: 'AMS',
        category: 'city',
      },
    ];

    // Filter by interest if specified (or show all 30+)
    const targetDestinations =
      interest === 'all'
        ? globalDestinations
        : globalDestinations.filter((d) => d.category === interest);

    // Filter out origin if destination matches origin iata
    const filteredDestinations = targetDestinations.filter(
      (d) => d.iata !== origin,
    );

    const targetDest = (
      destParam ||
      filteredDestinations[0]?.iata ||
      'LHR'
    ).toUpperCase();

    try {
      // Query live Duffel flight offers for target destination across the comparison dates
      const datePromises = dateStrs.map(async (d, index) => {
        try {
          const flightRes = await this.searchFlights({
            origin,
            destination: targetDest,
            date: d,
            adults: 1,
          });
          const lowestOffer = flightRes.data?.[0];
          const rawPrice = lowestOffer ? lowestOffer.price : null;
          return {
            id: `d${index + 1}`,
            label: new Date(d).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            rawPrice,
            price: rawPrice ? `$${Math.round(rawPrice)}` : 'Check Fare',
            airline: lowestOffer?.airline || null,
          };
        } catch {
          return {
            id: `d${index + 1}`,
            label: new Date(d).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            rawPrice: null,
            price: 'Check Fare',
            airline: null,
          };
        }
      });

      const datesData = await Promise.all(datePromises);
      const validPrices = datesData.filter(
        (d) => d.rawPrice !== null && (d.rawPrice as number) > 0,
      );
      const basePrice = (validPrices[0]?.rawPrice as number) || 0;

      const formattedDates = datesData.map((d) => {
        let trend = 'flat';
        let action = 'Check Live Fare';
        let message = 'Real-time GDS flight pricing';

        if (d.rawPrice && basePrice > 0) {
          if ((d.rawPrice as number) < basePrice * 0.95) {
            trend = 'down';
            action = 'Buy Now';
            message = 'Lower than usual for this route';
          } else if ((d.rawPrice as number) > basePrice * 1.05) {
            trend = 'up';
            action = 'Wait to Buy';
            message = 'Higher than usual for this route';
          } else {
            action = 'Good Deal';
            message = 'Prices are stable for this date';
          }
        }

        return {
          id: d.id,
          label: d.label,
          price: d.price,
          trend,
          action,
          message,
        };
      });

      const mapDestinations = filteredDestinations.map((dest) => {
        const isTarget = dest.iata === targetDest;
        const targetPrice = isTarget && basePrice > 0 ? basePrice : null;
        return {
          id: dest.id,
          name: dest.name,
          lat: dest.lat,
          lng: dest.lng,
          routeId: dest.iata,
          price: targetPrice ? `$${Math.round(targetPrice)}` : 'Live Rates',
          rawPrice: targetPrice || 0,
        };
      });

      const result = {
        status: 'success',
        provider: 'fx-port',
        origin,
        interest,
        data: {
          destinations: mapDestinations,
          dates: formattedDates,
        },
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error: any) {
      this.logger.error(`Live explore data failed: ${error.message}`);
      return {
        status: 'error',
        provider: 'fx-port',
        origin,
        interest,
        data: {
          destinations: [],
          dates: [],
        },
      };
    }
  }

  async getHomeDeals(query: any) {
    const origin = (query.origin || 'ACC').toUpperCase().slice(0, 3);
    const cacheKey = `home_deals_${origin}`;

    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const today = new Date();
    today.setDate(today.getDate() + 30);
    const dateStr = today.toISOString().split('T')[0];

    const dealTargets = [
      {
        city: 'London',
        iata: 'LHR',
        tag: 'Flight & Hotel',
        image: '/images/services/plane.jpg',
        bannerText: 'London Gateway',
      },
      {
        city: 'Dubai',
        iata: 'DXB',
        tag: 'Featured',
        image: '/images/middle-east/dubai-marina.jpg',
        bannerText: 'Dubai Luxury Stay',
      },
      {
        city: 'Paris',
        iata: 'CDG',
        tag: 'Top Value',
        image: '/images/europe/paris-and-eiffel-tower.jpg',
        bannerText: 'Paris Romantic Getaway',
      },
      {
        city: 'New York',
        iata: 'JFK',
        tag: 'Popular',
        image: '/images/north-america/new-york-city.jpg',
        bannerText: 'New York City Break',
      },
    ];

    try {
      const deals: any[] = [];
      const trending: any[] = [];

      const targetResults = await Promise.allSettled(
        dealTargets.map(async (target) => {
          const flightsRes = await this.searchFlights({
            origin,
            destination: target.iata,
            date: dateStr,
            adults: 1,
          });
          const bestOffer = flightsRes.data?.[0];
          return { target, bestOffer };
        }),
      );

      for (const res of targetResults) {
        if (res.status === 'fulfilled' && res.value.bestOffer) {
          const { target, bestOffer } = res.value;
          const p = bestOffer.price;
          deals.push({
            id: `deal_${target.iata}`,
            destination: target.city,
            iata: target.iata,
            title: target.bannerText,
            price: `$${Math.round(p)}`,
            rawPrice: p,
            currency: bestOffer.currency || 'USD',
            tag: target.tag,
            image: target.image,
            airline: bestOffer.airline,
            endsIn: 'Limited Live Inventory',
            freeCancel: true,
          });

          trending.push({
            id: `trend_${target.iata}`,
            name: target.city,
            iata: target.iata,
            price: `$${Math.round(p)}`,
            currency: bestOffer.currency || 'USD',
            image: target.image,
            badge: target.tag,
            airline: bestOffer.airline,
          });
        }
      }

      const result = {
        status: 'success',
        provider: 'fx-port',
        origin,
        data: {
          deals,
          trending,
        },
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error: any) {
      this.logger.error(`Live home deals failed: ${error.message}`);
      return {
        status: 'error',
        provider: 'fx-port',
        origin,
        data: {
          deals: [],
          trending: [],
        },
      };
    }
  }

  async searchHotels(query: any) {
    const destination = (query.destination || query.city || 'London').trim();
    const today = new Date();
    today.setDate(today.getDate() + 14);
    const checkIn = query.checkIn || today.toISOString().split('T')[0];

    const defaultCheckout = new Date(
      new Date(checkIn).getTime() + 86400000 * (parseInt(query.nights, 10) || 3),
    )
      .toISOString()
      .split('T')[0];
    const checkOut = query.checkOut || defaultCheckout;

    const adults =
      parseInt(query.adults, 10) || parseInt(query.guests, 10) || 2;
    const rooms = parseInt(query.rooms, 10) || 1;
    const children = parseInt(query.children, 10) || 0;

    try {
      const hotels = await this.hotelsService.search({
        destination,
        checkIn,
        checkOut,
        adults,
        guests: adults,
        rooms,
        children,
      });

      return {
        status: 'success',
        provider: 'ratehawk',
        data: hotels || [],
      };
    } catch (error: any) {
      this.logger.error(`RateHawk live hotel search failed: ${error.message}`);
      return {
        status: 'success',
        provider: 'ratehawk',
        data: [],
      };
    }
  }

  async searchPackages(query: any) {
    const [flightsResult, hotelsResult] = await Promise.all([
      this.searchFlights(query),
      this.searchHotels(query),
    ]);

    const flight = flightsResult.data?.[0];
    const hotel = hotelsResult.data?.[0];

    if (!flight || !hotel) {
      return { status: 'success', provider: 'dellics-bundler', data: [] };
    }

    const nights = parseInt(query.nights, 10) || 3;
    const hotelPricePerNight = hotel.price || 0;
    const rawTotal = flight.price + hotelPricePerNight * nights;
    const bundleDiscount = 0.95;
    const totalPrice = Math.round(rawTotal * bundleDiscount);

    return {
      status: 'success',
      provider: 'dellics-bundler',
      data: [
        {
          id: `pkg_${flight.id}_${hotel.id}`,
          flight,
          hotel,
          nights,
          originalPrice: Math.round(rawTotal),
          totalPrice,
          currency: flight.currency || hotel.currency || 'USD',
          savingsPercentage: 5,
        },
      ],
    };
  }

  async searchPlaces(query: any) {
    const q = (query.q || '').trim();
    if (!q) return { status: 'success', data: [] };

    // If type=hotel, use RateHawk multicomplete
    if (query.type === 'hotel') {
      const ratehawkId =
        this.configService.get<string>('RATEHAWK_API_ID') ||
        this.configService.get<string>('RATEHAWK_KEY_ID');
      const ratehawkKey = this.configService.get<string>('RATEHAWK_API_KEY');
      const rawBase =
        this.configService.get<string>('RATEHAWK_BASE_URL') ||
        'https://api-sandbox.ratehawk.com/api/b2b/v3';
      const ratehawkBase = rawBase.replace(/\/$/, '').includes('/api/b2b/v3')
        ? rawBase.replace(/\/$/, '')
        : `${rawBase.replace(/\/$/, '')}/api/b2b/v3`;

      if (!ratehawkId || !ratehawkKey) {
        return { status: 'success', provider: 'ratehawk', data: [] };
      }

      const authHeader = `Basic ${Buffer.from(`${ratehawkId}:${ratehawkKey}`).toString('base64')}`;
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            `${ratehawkBase}/search/multicomplete/`,
            { query: q, language: 'en' },
            {
              headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

        const regions = response.data?.data?.regions || [];
        const mapped = regions.map((r: any) => ({
          id: r.id.toString(),
          name: r.name,
          iataCode: null,
          type: 'city',
          cityName: r.name,
          countryName: r.country_code,
        }));

        return { status: 'success', provider: 'ratehawk', data: mapped };
      } catch (error: any) {
        this.logger.error('RateHawk Places search failed', error.message);
        return { status: 'error', data: [] };
      }
    }

    // Live global IATA places autocomplete
    try {
      const tpRes = await firstValueFrom(
        this.httpService.get(
          `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(q)}&locale=en&types[]=airport&types[]=city`,
          {
            headers: {
              Accept: 'application/json',
              'User-Agent': 'DellicsTravels/1.0',
            },
          },
        ),
      );

      const tpData = tpRes.data || [];
      const mapped = tpData.map((item: any) => ({
        id: item.code || item.id,
        name: item.name || item.main_airport_name,
        iataCode: item.code,
        type: item.type === 'city' ? 'city' : 'airport',
        cityName: item.city_name || item.name,
        countryName: item.country_name || '',
      }));

      return { status: 'success', provider: 'travelpayouts', data: mapped };
    } catch (err: any) {
      return { status: 'error', data: [] };
    }
  }



  /**
   * Live Foreign Exchange rates from Open Exchange Rates
   */
  async getFxRates(): Promise<{
    provider: string;
    base: string;
    timestamp: number;
    rates: Record<string, number>;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://open.er-api.com/v6/latest/USD', {
          headers: { Accept: 'application/json' },
        }),
      );

      if (response.data && response.data.rates) {
        return {
          provider: 'open-er-api',
          base: 'USD',
          timestamp: Date.now(),
          rates: response.data.rates,
        };
      }
    } catch (err: any) {
      this.logger.error('Live FX rate fetch failed', err.message);
    }

    return {
      provider: 'fallback',
      base: 'USD',
      timestamp: Date.now(),
      rates: {
        USD: 1.0,
        GHS: 15.65,
        EUR: 0.92,
        GBP: 0.78,
        AED: 3.67,
        ZAR: 18.25,
        NGN: 1580.0,
        CAD: 1.36,
      },
    };
  }

  /**
   * Converts an amount from one currency to another using FX-Port
   */
  async convertCurrency(
    amount: number,
    from: string = 'USD',
    to: string = 'GHS',
  ): Promise<{
    originalAmount: number;
    from: string;
    convertedAmount: number;
    to: string;
    rate: number;
  }> {
    const fx = await this.getFxRates();
    const fromRate = fx.rates[from.toUpperCase()] || 1.0;
    const toRate = fx.rates[to.toUpperCase()] || 1.0;

    // Convert from origin currency to USD, then from USD to target currency
    const amountInUsd = amount / fromRate;
    const converted = amountInUsd * toRate;
    const effectiveRate = toRate / fromRate;

    return {
      originalAmount: amount,
      from: from.toUpperCase(),
      convertedAmount: Math.round(converted * 100) / 100,
      to: to.toUpperCase(),
      rate: Math.round(effectiveRate * 10000) / 10000,
    };
  }

  // ==========================================
  // TOUR PACKAGES & CURATED EXPERIENCES
  // ==========================================

  async searchTours(query: any = {}) {
    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        const where: any = {};
        if (query.featured === 'true' || query.featured === true) {
          where.is_featured = true;
        }
        if (query.destination) {
          where.destination = { contains: query.destination, mode: 'insensitive' };
        }

        const dbTours = await (this.prisma as any).tourPackage.findMany({
          where,
          orderBy: { created_at: 'desc' },
        });

        if (dbTours && dbTours.length > 0) {
          return {
            status: 'success',
            provider: 'database',
            count: dbTours.length,
            data: dbTours.map((t: any) => ({
              id: t.id,
              name: t.title,
              slug: t.slug,
              destination: t.destination,
              price: `$${Number(t.price).toLocaleString()}`,
              rawPrice: Number(t.price),
              currency: t.currency,
              duration: t.duration,
              badge: t.badge,
              image: t.image_url,
              copy: t.overview,
              includes: t.includes,
              highlights: t.highlights,
              isFeatured: t.is_featured,
            })),
          };
        }
      }
    } catch (err: any) {
      this.logger.warn(`TourPackage DB lookup error: ${err.message}`);
    }

    return {
      status: 'success',
      provider: 'database',
      count: 0,
      data: [],
    };
  }

  // ==========================================
  // VERIFIED REVIEWS & SOCIAL PROOF
  // ==========================================

  async getFeaturedReviews() {
    try {
      if (this.prisma && (this.prisma as any).review) {
        const dbReviews = await (this.prisma as any).review.findMany({
          take: 6,
          orderBy: { created_at: 'desc' },
          include: { user: true },
        });

        if (dbReviews && dbReviews.length > 0) {
          return {
            status: 'success',
            provider: 'database',
            count: dbReviews.length,
            data: dbReviews.map((r: any) => ({
              id: r.id,
              name: r.user
                ? `${r.user.first_name || ''} ${r.user.last_name || ''}`.trim() ||
                  'Verified Traveler'
                : 'Verified Traveler',
              role: 'Verified Client',
              location: 'Accra / International',
              destination: 'Curated Itinerary',
              quote:
                r.text ||
                'Exceptional personalized service from the Dellics team.',
              rating: r.rating || 5,
              avatar: '/images/services/photo-10-2026-07-22-15-35-17.jpg',
            })),
          };
        }
      }
    } catch (err: any) {
      this.logger.warn(`Reviews DB lookup error: ${err.message}`);
    }

    return {
      status: 'success',
      provider: 'database',
      count: 0,
      data: [],
    };
  }
}

