import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ToursService } from './tours.service';
import { TourPackageDto } from './tours.types';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  async getTours(
    @Query('featured') featured?: string,
    @Query('destination') destination?: string,
    @Query('status') status?: string,
  ) {
    return this.toursService.getTours({ featured, destination, status });
  }

  @Get(':id')
  async getTourById(@Param('id') id: string) {
    return this.toursService.getTourByIdOrSlug(id);
  }

  @Post()
  async createTour(@Body() dto: TourPackageDto) {
    return this.toursService.createTour(dto);
  }

  @Put(':id')
  async updateTour(@Param('id') id: string, @Body() dto: Partial<TourPackageDto>) {
    return this.toursService.updateTour(id, dto);
  }

  @Delete(':id')
  async deleteTour(@Param('id') id: string) {
    return this.toursService.deleteTour(id);
  }
}
