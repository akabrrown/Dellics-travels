import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogSchoolDto } from './dto/create-school.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('schools')
  async getSchools(@Query('country') country?: string) {
    return this.catalogService.getSchools(country);
  }

  @Post('schools')
  @UseGuards(AdminAuthGuard)
  async createSchool(@Body() body: CreateCatalogSchoolDto) {
    return this.catalogService.createSchool(body);
  }

  @Delete('schools/:id')
  @UseGuards(AdminAuthGuard)
  async deleteSchool(@Param('id') id: string) {
    return this.catalogService.deleteSchool(id);
  }
}
