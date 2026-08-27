import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly cache = new Map<string, { timestamp: number; data: any }>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in-memory cache TTL

  private getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      this.logger.log(
        `[Cache HIT] Serving cached Duffel response for key: ${key}`,
      );
      return cached.data;
    }
    return null;
  }

  private setCached(key: string, data: any) {
    this.cache.set(key, { timestamp: Date.now(), data });
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async searchFlights(query: any) {
    const duffelApiKey = this.configService.get<string>('DUFFEL_API_KEY');

    if (!duffelApiKey || duffelApiKey === 'placeholder') {
      this.logger.warn('DUFFEL_API_KEY not configured. Returning mock data.');
      return this.getMockedFlights(query);
    }

    const today = new Date();
    today.setDate(today.getDate() + 30);
    const dateStr = query.date || today.toISOString().split('T')[0];
    const origin = (query.origin || 'LHR').toUpperCase().slice(0, 3);
    const destination = (query.destination || 'JFK').toUpperCase().slice(0, 3);

    const duffelHeaders = {
      Authorization: `Bearer ${duffelApiKey}`,
      'Duffel-Version': 'v2',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      // Step 1: Create an offer request
      const offerRequestResponse = await firstValueFrom(
        this.httpService.post(
          'https://api.duffel.com/air/offer_requests',
          {
            data: {
              slices: [{ origin, destination, departure_date: dateStr }],
              passengers: [{ type: 'adult' }],
              cabin_class: 'economy',
            },
          },
          { headers: duffelHeaders },
        ),
      );

      const offerRequestId = offerRequestResponse.data?.data?.id;
      if (!offerRequestId) {
        this.logger.error(
          'Duffel offer request returned no ID',
          offerRequestResponse.data,
        );
        throw new Error('Duffel offer request returned no ID');
      }

      this.logger.log(`Duffel offer request created: ${offerRequestId}`);

      // Step 2: Fetch the offers for this request (they are returned immediately in sandbox)
      const offersResponse = await firstValueFrom(
        this.httpService.get(
          `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}&limit=10`,
          { headers: duffelHeaders },
        ),
      );

      const offers = offersResponse.data?.data || [];
      this.logger.log(`Duffel returned ${offers.length} offers`);

      const mapped = offers.slice(0, 10).map((offer: any) => {
        const firstSlice = offer.slices?.[0];
        const firstSegment = firstSlice?.segments?.[0];
        const lastSegment =
          firstSlice?.segments?.[firstSlice.segments.length - 1];

        return {
          id: offer.id,
          origin: firstSegment?.origin?.iata_code || origin,
          destination: lastSegment?.destination?.iata_code || destination,
          price: parseFloat(offer.total_amount),
          currency: offer.total_currency,
          airline: offer.owner?.name || 'Unknown Airline',
          iataCode: offer.owner?.iata_code || '',
          departureTime: firstSegment?.departing_at || null,
          arrivalTime: lastSegment?.arriving_at || null,
          duration: firstSlice?.duration || null,
          stops: (firstSlice?.segments?.length || 1) - 1,
          cabinClass: offer.cabin_class || 'economy',
        };
      });

      return {
        status: 'success',
        provider: 'duffel',
        data: mapped,
      };
    } catch (error: any) {
      const detail = error.response?.data;
      this.logger.error('Duffel flight search failed', detail || error.message);
      // Graceful fallback so mobile doesn't get a 500
      return this.getMockedFlights(query);
    }
  }

  async getExploreData(query: any) {
    const duffelApiKey = this.configService.get<string>('DUFFEL_API_KEY');
    if (!duffelApiKey || duffelApiKey === 'placeholder') {
      throw new HttpException(
        'Duffel API key is not configured for realtime requests.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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

    const duffelHeaders = {
      Authorization: `Bearer ${duffelApiKey}`,
      'Duffel-Version': 'v2',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      // Create offer requests concurrently for the selected destinations from home airport
      const offerPromises = filteredDestinations.map(async (dest) => {
        try {
          const offerRequestResponse = await firstValueFrom(
            this.httpService.post(
              'https://api.duffel.com/air/offer_requests',
              {
                data: {
                  slices: [
                    { origin, destination: dest.iata, departure_date: dateStr },
                  ],
                  passengers: [{ type: 'adult' }],
                  cabin_class: 'economy',
                },
              },
              { headers: duffelHeaders },
            ),
          );
          const offerRequestId = offerRequestResponse.data?.data?.id;

          const offersResponse = await firstValueFrom(
            this.httpService.get(
              `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}&limit=1`,
              { headers: duffelHeaders },
            ),
          );

          const offers = offersResponse.data?.data || [];
          const price =
            offers.length > 0 ? parseFloat(offers[0].total_amount) : null;

          return {
            id: dest.id,
            name: dest.name,
            lat: dest.lat,
            lng: dest.lng,
            routeId: dest.iata,
            price: price ? `$${Math.round(price)}` : 'N/A',
            rawPrice: price || 9999,
          };
        } catch (e: any) {
          this.logger.warn(
            `Could not fetch live Duffel fare from ${origin} to ${dest.iata}: ${e.message}`,
          );
          return {
            id: dest.id,
            name: dest.name,
            lat: dest.lat,
            lng: dest.lng,
            routeId: dest.iata,
            price: 'N/A',
            rawPrice: 9999,
          };
        }
      });

      const mapDestinations = await Promise.all(offerPromises);

      // Select a valid destination with a real fare (or specified destination query)
      const validDest = mapDestinations.find(
        (d) => d.rawPrice && d.rawPrice < 9999,
      );
      const baselineDest = query.destination || validDest?.routeId || 'LHR';
      const baseFare =
        validDest?.rawPrice && validDest.rawPrice < 9999
          ? validDest.rawPrice
          : 480;

      const datePromises = dateStrs.map(async (d, index) => {
        try {
          const dReq = await firstValueFrom(
            this.httpService.post(
              'https://api.duffel.com/air/offer_requests',
              {
                data: {
                  slices: [
                    { origin, destination: baselineDest, departure_date: d },
                  ],
                  passengers: [{ type: 'adult' }],
                  cabin_class: 'economy',
                },
              },
              { headers: duffelHeaders },
            ),
          );
          const oId = dReq.data?.data?.id;
          const oRes = await firstValueFrom(
            this.httpService.get(
              `https://api.duffel.com/air/offers?offer_request_id=${oId}&limit=1`,
              { headers: duffelHeaders },
            ),
          );
          const p = oRes.data?.data?.[0]
            ? parseFloat(oRes.data.data[0].total_amount)
            : 0;

          const finalPrice =
            p > 0
              ? p
              : baseFare * (index === 0 ? 1 : index === 1 ? 0.93 : 1.15);

          return {
            id: `d${index + 1}`,
            label: new Date(d).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            rawPrice: finalPrice,
            price: `$${Math.round(finalPrice)}`,
          };
        } catch {
          const fallbackPrice =
            baseFare * (index === 0 ? 1 : index === 1 ? 0.93 : 1.15);
          return {
            id: `d${index + 1}`,
            label: new Date(d).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            rawPrice: fallbackPrice,
            price: `$${Math.round(fallbackPrice)}`,
          };
        }
      });

      const datesData = await Promise.all(datePromises);

      const basePrice = datesData[0]?.rawPrice || 500;
      const formattedDates = datesData.map((d) => {
        let trend = 'flat';
        let action = 'Good Deal';
        let message = 'Prices are stable for this date';

        if (d.rawPrice > 0 && d.rawPrice < basePrice * 0.95) {
          trend = 'down';
          action = 'Buy Now';
          message = 'Lower than usual for this route';
        } else if (d.rawPrice > basePrice * 1.05) {
          trend = 'up';
          action = 'Wait to Buy';
          message = 'Expected to drop later';
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

      const result = {
        status: 'success',
        provider: 'duffel',
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
      this.logger.error(
        'Duffel explore realtime failed, returning fallback dataset',
        error.response?.data || error.message,
      );
      return {
        status: 'fallback',
        provider: 'duffel-fallback',
        origin,
        interest,
        data: {
          destinations: [
            {
              id: '1',
              name: 'London',
              lat: 51.5074,
              lng: -0.1278,
              routeId: 'LHR',
              price: '$520',
              rawPrice: 520,
            },
            {
              id: '2',
              name: 'Dubai',
              lat: 25.2048,
              lng: 55.2708,
              routeId: 'DXB',
              price: '$680',
              rawPrice: 680,
            },
            {
              id: '3',
              name: 'Paris',
              lat: 48.8566,
              lng: 2.3522,
              routeId: 'CDG',
              price: '$490',
              rawPrice: 490,
            },
          ],
          dates: [
            {
              id: 'd1',
              label: 'Oct 15',
              price: '$520',
              trend: 'flat',
              action: 'Good Deal',
              message: 'Prices are stable',
            },
            {
              id: 'd2',
              label: 'Oct 16',
              price: '$480',
              trend: 'down',
              action: 'Buy Now',
              message: 'Lower than usual',
            },
          ],
        },
      };
    }
  }

  async getHomeDeals(query: any) {
    const origin = (query.origin || 'ACC').toUpperCase().slice(0, 3);
    const cacheKey = `home_deals_${origin}`;

    const cached = this.getCached(cacheKey);
    if (cached) return cached;
    const duffelApiKey = this.configService.get<string>('DUFFEL_API_KEY');

    const today = new Date();
    today.setDate(today.getDate() + 30);
    const dateStr = today.toISOString().split('T')[0];

    const duffelHeaders = {
      Authorization: `Bearer ${duffelApiKey}`,
      'Duffel-Version': 'v2',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Target routes for homepage deals and trending
    const dealTargets = [
      {
        city: 'London',
        iata: 'LHR',
        tag: 'Flight and Hotel',
        image:
          'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
        bannerText: 'London Gateway',
      },
      {
        city: 'Dubai',
        iata: 'DXB',
        tag: 'Limited Offer',
        image:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
        bannerText: 'Dubai Luxury Stay',
      },
      {
        city: 'Paris',
        iata: 'CDG',
        tag: 'Top Value',
        image:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
        bannerText: 'Paris Romantic Getaway',
      },
    ];

    const trendingTargets = [
      {
        name: 'London',
        iata: 'LHR',
        image:
          'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
        badge: 'Popular',
      },
      {
        name: 'Dubai',
        iata: 'DXB',
        image:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
        badge: 'Trending',
      },
      {
        name: 'Paris',
        iata: 'CDG',
        image:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
        badge: 'Top Pick',
      },
      {
        name: 'New York',
        iata: 'JFK',
        image:
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop',
        badge: 'Featured',
      },
    ];

    try {
      // Fetch live deal fares
      const dealsPromises = dealTargets.map(async (target) => {
        try {
          const req = await firstValueFrom(
            this.httpService.post(
              'https://api.duffel.com/air/offer_requests',
              {
                data: {
                  slices: [
                    {
                      origin,
                      destination: target.iata,
                      departure_date: dateStr,
                    },
                  ],
                  passengers: [{ type: 'adult' }],
                  cabin_class: 'economy',
                },
              },
              { headers: duffelHeaders },
            ),
          );
          const oId = req.data?.data?.id;
          const res = await firstValueFrom(
            this.httpService.get(
              `https://api.duffel.com/air/offers?offer_request_id=${oId}&limit=1`,
              { headers: duffelHeaders },
            ),
          );
          const p = res.data?.data?.[0]
            ? parseFloat(res.data.data[0].total_amount)
            : 520;

          return {
            id: `deal_${target.iata}`,
            destination: target.city,
            iata: target.iata,
            title: target.bannerText,
            price: `$${Math.round(p)}`,
            rawPrice: p,
            tag: target.tag,
            image: target.image,
            endsIn: '4 hours · 3 left',
            freeCancel: true,
          };
        } catch {
          return {
            id: `deal_${target.iata}`,
            destination: target.city,
            iata: target.iata,
            title: target.bannerText,
            price: '$490',
            rawPrice: 490,
            tag: target.tag,
            image: target.image,
            endsIn: '6 hours · 2 left',
            freeCancel: true,
          };
        }
      });

      // Fetch live trending fares
      const trendingPromises = trendingTargets.map(async (target) => {
        try {
          const req = await firstValueFrom(
            this.httpService.post(
              'https://api.duffel.com/air/offer_requests',
              {
                data: {
                  slices: [
                    {
                      origin,
                      destination: target.iata,
                      departure_date: dateStr,
                    },
                  ],
                  passengers: [{ type: 'adult' }],
                  cabin_class: 'economy',
                },
              },
              { headers: duffelHeaders },
            ),
          );
          const oId = req.data?.data?.id;
          const res = await firstValueFrom(
            this.httpService.get(
              `https://api.duffel.com/air/offers?offer_request_id=${oId}&limit=1`,
              { headers: duffelHeaders },
            ),
          );
          const p = res.data?.data?.[0]
            ? parseFloat(res.data.data[0].total_amount)
            : 480;

          return {
            id: `trend_${target.iata}`,
            name: target.name,
            iata: target.iata,
            price: `$${Math.round(p)}`,
            image: target.image,
            badge: target.badge,
          };
        } catch {
          return {
            id: `trend_${target.iata}`,
            name: target.name,
            iata: target.iata,
            price: '$480',
            image: target.image,
            badge: target.badge,
          };
        }
      });

      const [deals, trending] = await Promise.all([
        Promise.all(dealsPromises),
        Promise.all(trendingPromises),
      ]);

      const result = {
        status: 'success',
        provider: 'duffel+ratehawk',
        origin,
        data: {
          deals,
          trending,
        },
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error: any) {
      this.logger.error(
        'Duffel home deals failed, returning fallback dataset',
        error.response?.data || error.message,
      );
      return {
        status: 'fallback',
        provider: 'duffel-fallback',
        origin,
        data: {
          deals: [
            {
              id: 'deal_LHR',
              destination: 'London',
              iata: 'LHR',
              title: 'London Gateway',
              price: '$520',
              rawPrice: 520,
              tag: 'Flight and Hotel',
              image:
                'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
              endsIn: '4 hours · 3 left',
              freeCancel: true,
            },
            {
              id: 'deal_DXB',
              destination: 'Dubai',
              iata: 'DXB',
              title: 'Dubai Luxury Stay',
              price: '$680',
              rawPrice: 680,
              tag: 'Limited Offer',
              image:
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
              endsIn: '6 hours · 2 left',
              freeCancel: true,
            },
            {
              id: 'deal_CDG',
              destination: 'Paris',
              iata: 'CDG',
              title: 'Paris Getaway',
              price: '$490',
              rawPrice: 490,
              tag: 'Top Value',
              image:
                'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
              endsIn: '2 hours · 5 left',
              freeCancel: true,
            },
          ],
          trending: [
            {
              id: 'trend_LHR',
              name: 'London',
              iata: 'LHR',
              price: '$520',
              image:
                'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
              badge: 'Popular',
            },
            {
              id: 'trend_DXB',
              name: 'Dubai',
              iata: 'DXB',
              price: '$680',
              image:
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
              badge: 'Trending',
            },
            {
              id: 'trend_CDG',
              name: 'Paris',
              iata: 'CDG',
              price: '$490',
              image:
                'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
              badge: 'Top Pick',
            },
            {
              id: 'trend_JFK',
              name: 'New York',
              iata: 'JFK',
              price: '$750',
              image:
                'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop',
              badge: 'Featured',
            },
          ],
        },
      };
    }
  }

  async searchHotels(query: any) {
    const ratehawkId = this.configService.get<string>('RATEHAWK_KEY_ID');
    const ratehawkKey = this.configService.get<string>('RATEHAWK_API_KEY');

    if (!ratehawkId || !ratehawkKey) {
      this.logger.warn(
        'RATEHAWK credentials not configured. Returning mock data.',
      );
      return this.getMockedHotels(query);
    }

    const destination = query.destination || 'London';
    const authHeader = `Basic ${Buffer.from(`${ratehawkId}:${ratehawkKey}`).toString('base64')}`;

    try {
      // Step 1: Multicomplete to get Region ID
      const multiRes = await firstValueFrom(
        this.httpService.post(
          'https://api-sandbox.worldota.net/api/b2b/v3/search/multicomplete/',
          { query: destination, language: 'en' },
          {
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const regions = multiRes.data?.data?.regions || [];
      if (regions.length === 0) {
        this.logger.warn(`RateHawk: No region found for "${destination}"`);
        return this.getMockedHotels(query);
      }

      const regionId = regions[0].id;

      // Step 2: Search SERP by Region
      const today = new Date();
      today.setDate(today.getDate() + 14);
      const checkin = today.toISOString().split('T')[0];

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + (parseInt(query.nights) || 3));
      const checkout = tomorrow.toISOString().split('T')[0];

      const serpRes = await firstValueFrom(
        this.httpService.post(
          'https://api-sandbox.worldota.net/api/b2b/v3/search/serp/region/',
          {
            checkin,
            checkout,
            residency: 'gb',
            language: 'en',
            guests: [{ adults: parseInt(query.adults) || 2, children: [] }],
            region_id: regionId,
            currency: 'USD',
          },
          {
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const hotels = serpRes.data?.data?.hotels || [];

      if (hotels.length === 0) {
        return this.getMockedHotels(query);
      }

      const mapped = hotels.slice(0, 10).map((hotel: any) => {
        // RateHawk returns rates in an array
        const minPrice = hotel.rates?.[0]?.daily_prices?.[0] || 150;

        return {
          id: hotel.id,
          name: hotel.name || 'RateHawk Hotel',
          location: destination,
          rating: hotel.star_rating || 4.0,
          reviewCount: 150,
          pricePerNight: Math.round(parseFloat(minPrice)),
          currency: 'USD',
          photoReference: null,
          website: null,
        };
      });

      return {
        status: 'success',
        provider: 'ratehawk',
        data: mapped,
      };
    } catch (error: any) {
      const detail = error.response?.data;
      this.logger.error(
        'RateHawk hotel search failed',
        detail || error.message,
      );
      return this.getMockedHotels(query);
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

    return {
      status: 'success',
      provider: 'dellics-bundler',
      data: [
        {
          id: `pkg_${flight.id}_${hotel.id}`,
          flight,
          hotel,
          nights: parseInt(query.nights) || 3,
          totalPrice:
            flight.price + hotel.pricePerNight * (parseInt(query.nights) || 3),
          currency: flight.currency || 'USD',
        },
      ],
    };
  }

  private getMockedFlights(query: any) {
    const origin = (query.origin || 'ACC').toUpperCase();
    const destination = (query.destination || 'LHR').toUpperCase();
    return {
      status: 'success',
      provider: 'mocked',
      data: [
        {
          id: 'f1',
          origin,
          destination,
          price: 520,
          currency: 'USD',
          airline: 'British Airways',
          iataCode: 'BA',
          departureTime: null,
          arrivalTime: null,
          duration: 'PT6H30M',
          stops: 0,
          cabinClass: 'economy',
        },
        {
          id: 'f2',
          origin,
          destination,
          price: 480,
          currency: 'USD',
          airline: 'KLM',
          iataCode: 'KL',
          departureTime: null,
          arrivalTime: null,
          duration: 'PT8H10M',
          stops: 1,
          cabinClass: 'economy',
        },
      ],
    };
  }

  private getMockedHotels(query: any) {
    const location = query.destination || 'London';
    return {
      status: 'success',
      provider: 'mocked',
      data: [
        {
          id: 'h1',
          name: 'The Grand Meridian',
          location,
          rating: 4.8,
          reviewCount: 2314,
          pricePerNight: 185,
          currency: 'USD',
          photoReference: null,
          website: null,
        },
        {
          id: 'h2',
          name: 'City Boutique Inn',
          location,
          rating: 4.3,
          reviewCount: 891,
          pricePerNight: 95,
          currency: 'USD',
          photoReference: null,
          website: null,
        },
      ],
    };
  }

  async searchPlaces(query: any) {
    const q = query.q || '';
    if (!q) return { status: 'success', data: [] };

    // If type=hotel, use RateHawk multicomplete
    if (query.type === 'hotel') {
      const ratehawkId = this.configService.get<string>('RATEHAWK_KEY_ID');
      const ratehawkKey = this.configService.get<string>('RATEHAWK_API_KEY');

      if (!ratehawkId || !ratehawkKey) {
        return { status: 'success', provider: 'mocked', data: [] };
      }

      const authHeader = `Basic ${Buffer.from(`${ratehawkId}:${ratehawkKey}`).toString('base64')}`;
      try {
        const response = await firstValueFrom(
          this.httpService.post(
            'https://api-sandbox.worldota.net/api/b2b/v3/search/multicomplete/',
            { query: q, language: 'en' },
            {
              headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

        let regions = response.data?.data?.regions || [];

        // RateHawk Sandbox is notoriously empty. If no regions are found, inject mocks.
        if (regions.length === 0) {
          const lowerQ = q.toLowerCase();
          const mockRegions = [
            {
              id: 536,
              name: 'London',
              type: 'City',
              country_code: 'United Kingdom',
            },
            {
              id: 2470,
              name: 'New York',
              type: 'City',
              country_code: 'United States',
            },
            {
              id: 1221,
              name: 'Dubai',
              type: 'City',
              country_code: 'United Arab Emirates',
            },
            { id: 185, name: 'Accra', type: 'City', country_code: 'Ghana' },
          ];
          regions = mockRegions.filter((r) =>
            r.name.toLowerCase().includes(lowerQ),
          );
        }

        const mapped = regions.map((r: any) => ({
          id: r.id.toString(),
          name: r.name,
          iataCode: null,
          type: 'city', // Ratehawk uses 'Region' and 'City'
          cityName: r.name,
          countryName: r.country_code,
        }));

        return { status: 'success', provider: 'ratehawk', data: mapped };
      } catch (error: any) {
        this.logger.error('RateHawk Places search failed', error.message);
        return { status: 'error', data: [] };
      }
    }

    // Default to Duffel for Flights
    const duffelApiKey = this.configService.get<string>('DUFFEL_API_KEY');

    if (!duffelApiKey || duffelApiKey === 'placeholder') {
      // Mock places
      const mockPlaces = [
        {
          id: 'LHR',
          name: 'London Heathrow',
          iataCode: 'LHR',
          type: 'airport',
          cityName: 'London',
          countryName: 'United Kingdom',
        },
        {
          id: 'ACC',
          name: 'Kotoka International',
          iataCode: 'ACC',
          type: 'airport',
          cityName: 'Accra',
          countryName: 'Ghana',
        },
        {
          id: 'JFK',
          name: 'John F. Kennedy',
          iataCode: 'JFK',
          type: 'airport',
          cityName: 'New York',
          countryName: 'United States',
        },
        {
          id: 'DXB',
          name: 'Dubai International',
          iataCode: 'DXB',
          type: 'airport',
          cityName: 'Dubai',
          countryName: 'United Arab Emirates',
        },
      ].filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.cityName.toLowerCase().includes(q.toLowerCase()),
      );

      return { status: 'success', provider: 'mocked', data: mockPlaces };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.duffel.com/places/suggestions?query=${encodeURIComponent(q)}`,
          {
            headers: {
              Authorization: `Bearer ${duffelApiKey}`,
              'Duffel-Version': 'v2',
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        ),
      );

      const places = response.data?.data || [];
      const mapped = places.map((p: any) => ({
        id: p.id,
        name: p.name,
        iataCode: p.iata_code || p.iata_country_code,
        type: p.type, // 'airport' | 'city'
        cityName: p.city_name || p.name,
        countryName: p.country_name || '',
      }));

      return { status: 'success', provider: 'duffel', data: mapped };
    } catch (error: any) {
      this.logger.error(
        'Duffel Places search failed',
        error.response?.data || error.message,
      );
      return { status: 'error', data: [] };
    }
  }
}
