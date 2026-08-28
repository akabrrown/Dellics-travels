import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }

  @Get()
  findAll(@Query('kind') kind?: string) {
    return this.inquiries.findAll(kind);
  }

  @Get('stats')
  getStats() {
    return this.inquiries.getStats();
  }
}
