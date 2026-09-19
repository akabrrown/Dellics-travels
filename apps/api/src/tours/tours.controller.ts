import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
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
  @Post('book')
  async bookTour(@Request() req, @Body() body: any) {
    return this.toursService.createBooking(req.user.id, body);
  }
}