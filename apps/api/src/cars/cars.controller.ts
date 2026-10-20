import { Body, Controller, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import type { CarSearchCriteria } from '../providers/cars/interfaces/car.types';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('search')
  search(@Body() criteria: CarSearchCriteria) {
    return this.carsService.search(criteria);
  }
}
