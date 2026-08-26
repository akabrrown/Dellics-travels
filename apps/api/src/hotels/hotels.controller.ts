import { Body, Controller, Post } from '@nestjs/common';
import { SearchHotelsDto } from './dto/search-hotels.dto';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Post('search')
  search(@Body() dto: SearchHotelsDto) {
    return this.hotels.search(dto);
  }
}
