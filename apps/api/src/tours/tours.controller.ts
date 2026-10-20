import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

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


  @UseGuards(AdminAuthGuard)
  @Post()
  async createTour(@Body() body: any) {
    return this.toursService.createTour(body);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id')
  async updateTour(@Param('id') id: string, @Body() body: any) {
    return this.toursService.updateTour(id, body);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  async deleteTour(@Param('id') id: string) {
    return this.toursService.deleteTour(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('book')
  async bookTour(@Request() req, @Body() body: any) {
    return this.toursService.createBooking(req.user.id, body);
  }
}