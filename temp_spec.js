const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.spec.ts';

const specContent = `import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

function buildService(): HotelsService {
  const config = new ConfigService();
  const rateHawk = new RateHawkProvider(config);
  const prisma = {} as PrismaService;
  const payments = {} as PaymentsService;
  
  return new HotelsService(config, rateHawk, prisma, payments);
}

describe('HotelsService', () => {
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
  });
});
`;

fs.writeFileSync(path, specContent);
console.log('Successfully updated hotels.service.spec.ts');
