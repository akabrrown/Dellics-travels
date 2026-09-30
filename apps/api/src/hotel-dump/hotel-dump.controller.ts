import {
  Controller,
  Post,
  Query,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HotelDumpService } from './hotel-dump.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('hotel-dump')
@UseGuards(AdminAuthGuard)
export class HotelDumpController {
  constructor(private readonly dumpService: HotelDumpService) {}

  /**
   * Manual trigger for admin use.
   * POST /hotel-dump/sync?type=full
   * POST /hotel-dump/sync?type=incremental
   */
  @Post('sync')
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerSync(@Query('type') type: string) {
    if (type !== 'full' && type !== 'incremental') {
      throw new BadRequestException('type must be "full" or "incremental"');
    }
    // Fire and forget — dump can take minutes for a full sync
    this.dumpService.syncDump(type as 'full' | 'incremental').catch(() => {});
    return { message: `${type} dump sync started`, status: 'accepted' };
  }
}
