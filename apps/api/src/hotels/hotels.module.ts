import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';
import { HotelbedsProvider } from '../providers/hotels/hotelbeds/hotelbeds.provider';
import { ExpediaProvider } from '../providers/hotels/expedia/expedia.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [PrismaModule, PaymentsModule],
  controllers: [HotelsController],
  providers: [HotelsService, RateHawkProvider, HotelbedsProvider, ExpediaProvider],
  exports: [HotelsService],
})
export class HotelsModule {}
