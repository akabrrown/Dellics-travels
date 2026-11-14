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
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('consultants')
@UseGuards(AdminAuthGuard)
export class ConsultantsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  async findAll(@Query('activeOnly') activeOnly?: string) {
    const isActiveOnly = activeOnly === 'true' || activeOnly === '1';
    return this.consultationsService.findAllConsultants(isActiveOnly);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.consultationsService.findOneConsultant(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateConsultantDto) {
    return this.consultationsService.createConsultant(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateConsultantDto,
  ) {
    return this.consultationsService.updateConsultant(id, dto);
  }
}

