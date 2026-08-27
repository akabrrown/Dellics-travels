import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('flights')
  async searchFlights(@Query() query: any) {
    return this.searchService.searchFlights(query);
  }

  @Get('explore')
  async getExploreData(@Query() query: any) {
    return this.searchService.getExploreData(query);
  }

  @Get('home-deals')
  async getHomeDeals(@Query() query: any) {
    return this.searchService.getHomeDeals(query);
  }

  @Get('hotels')
  async searchHotels(@Query() query: any) {
    return this.searchService.searchHotels(query);
  }

  @Get('packages')
  async searchPackages(@Query() query: any) {
    return this.searchService.searchPackages(query);
  }

  @Get('places')
  async searchPlaces(@Query() query: any) {
    return this.searchService.searchPlaces(query);
  }

  @Get('tours')
  async searchTours(@Query() query: any) {
    return this.searchService.searchTours(query);
  }

  @Get('reviews/featured')
  async getFeaturedReviews() {
    return this.searchService.getFeaturedReviews();
  }

  // ==========================================
  // FX-PORT CURRENCY CONVERSION & LIVE RATES
  // ==========================================

  @Get('fx/rates')
  async getFxRates() {
    return this.searchService.getFxRates();
  }

  @Get('fx/convert')
  async convertCurrency(
    @Query('amount') amount: string,
    @Query('from') from: string = 'USD',
    @Query('to') to: string = 'GHS',
  ) {
    const numAmount = parseFloat(amount) || 1.0;
    return this.searchService.convertCurrency(numAmount, from, to);
  }
}

