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
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        hotels: [
          {
            hotel_id: 'h1',
            name: 'Marina Bay Grand',
            stars: 5,
            address: 'Dubai Marina',
            city: 'Dubai',
            country: 'UAE',
            min_price: 1540,
            currency: 'GHS',
            photos: ['https://cdn.test/1.jpg'],
            amenities: ['WiFi', 'Pool'],
            description: 'Luxury hotel.',
          },
        ],
      }),
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
        currency: 'GHS',
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

  it('returns verified fallback catalog when upstream fails', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));
    const service = buildService();
    const result = await service.search({
      destination: 'Accra',
      checkIn: '2099-01-01',
      checkOut: '2099-01-08',
      guests: 2,
      rooms: 1,
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].city).toBe('Accra');
  });
});
