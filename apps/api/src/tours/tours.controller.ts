import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  async getTours(@Query() query: any) {
    return this.toursService.getTours(query);
  }

  @Get(':slug')
  async getTourBySlug(@Param('slug') slug: string) {
    return this.toursService.getTourBySlug(slug);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  async createTour(@Body() body: any) {
    return this.toursService.createTour(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTour(@Param('id') id: string, @Body() body: any) {
    return this.toursService.updateTour(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('book')
  async bookTour(@Request() req, @Body() body: any) {
    return this.toursService.createBooking(req.user.id, body);
  }
}