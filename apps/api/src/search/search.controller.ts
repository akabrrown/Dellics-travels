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
}
