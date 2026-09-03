import { ConfigService } from '@nestjs/config';
import { BadRequestException, BadGatewayException } from '@nestjs/common';
import { HotelsService } from './hotels.service';

type FetchMock = jest.Mock;

function buildService(): HotelsService {
  return new HotelsService(
    new ConfigService({
      RATEHAWK_API_ID: 'test-id',
      RATEHAWK_API_KEY: 'test-key',
      RATEHAWK_BASE_URL: 'https://ratehawk.test',
    }),
  );
}

describe('HotelsService', () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
  });

  it('rejects check-out on or before check-in', async () => {
    const service = buildService();
    await expect(
      service.search({
        destination: 'Accra',
        checkIn: '2099-09-10',
        checkOut: '2099-09-10',
        guests: 2,
        rooms: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects check-in in the past', async () => {
    const service = buildService();
    await expect(
      service.search({
        destination: 'Accra',
        checkIn: '2020-01-01',
        checkOut: '2020-01-05',
        guests: 2,
        rooms: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normalizes upstream hotels into the public shape', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes('/search/multicomplete/')) {
        return {
          ok: true,
          json: async () => ({
            data: {
              regions: [{ id: 6053839, name: 'Dubai', country_code: 'AE' }],
            },
          }),
        };
      }
      if (url.includes('/search/serp/region/')) {
        return {
          ok: true,
          json: async () => ({
            data: {
              hotels: [
                {
                  id: 'h1',
                  hid: 101,
                  rates: [
                    {
                      payment_options: {
                        payment_types: [{ amount: '1540', currency_code: 'USD' }],
                      },
                    },
                  ],
                },
              ],
            },
          }),
        };
      }
      if (url.includes('/hotel/info/')) {
        return {
          ok: true,
          json: async () => ({
            data: {
              name: 'Marina Bay Grand',
              star_rating: 5,
              address: 'Dubai Marina',
              region: { name: 'Dubai', country_code: 'UAE' },
              images: ['https://cdn.test/1.jpg'],
              amenity_groups: [{ amenities: ['WiFi', 'Pool'] }],
              description: 'Luxury hotel.',
            },
          }),
        };
      }
      return { ok: false, status: 404 };
    });

    const service = buildService();
    const result = await service.search({
      destination: 'Dubai',
      checkIn: '2099-01-01',
      checkOut: '2099-01-08',
      guests: 2,
      rooms: 1,
    });
    expect(result).toEqual([
      {
        id: 'h1',
        name: 'Marina Bay Grand',
        rating: 5,
        address: 'Dubai Marina',
        city: 'Dubai',
        country: 'UAE',
        price: 1540,
        currency: 'USD',
        images: ['https://cdn.test/1.jpg'],
        amenities: ['WiFi', 'Pool'],
        description: 'Luxury hotel.',
      },
    ]);
    // credentials must travel in headers, never in the request body
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://ratehawk.test/search/multicomplete/');
    expect(init.headers['X-API-ID']).toBe('test-id');
    expect(init.headers['X-API-Key']).toBe('test-key');
    expect(init.body).not.toContain('test-key');
  });

  it('returns empty array when upstream fails', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));
    const service = buildService();
    const result = await service.search({
      destination: 'Accra',
      checkIn: '2099-01-01',
      checkOut: '2099-01-08',
      guests: 2,
      rooms: 1,
    });
    expect(result).toEqual([]);
  });
});
