import { Module } from '@nestjs/common';
import { HotelDumpService } from './hotel-dump.service';
import { HotelDumpController } from './hotel-dump.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HotelDumpController],
  providers: [HotelDumpService],
  exports: [HotelDumpService],
})
export class HotelDumpModule {}
