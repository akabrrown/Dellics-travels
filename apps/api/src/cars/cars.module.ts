import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CartrawlerProvider } from '../providers/cars/cartrawler/cartrawler.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService, CartrawlerProvider],
  exports: [CarsService],
})
export class CarsModule {}
