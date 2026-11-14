import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  // PUBLIC: Submits a new consultation booking
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async create(@Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(dto);
  }

  // ADMIN ONLY: List consultations with optional status filter, newest first
  @Get()
  @UseGuards(AdminAuthGuard)
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const user = req.user;
    const isConsultantOnly = user?.roleId === 'consultant';
    return this.consultationsService.findAll(status, isConsultantOnly ? user.email : undefined);
  }

  // ADMIN ONLY: Retrieve a single consultation request
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(id);
  }

  // ADMIN ONLY: Update status, assigned consultant, or internal notes
  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateConsultationDto,
  ) {
    return this.consultationsService.update(id, dto);
  }
}

