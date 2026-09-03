import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EsimService } from './esim.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('esim')
export class EsimController {
  constructor(private readonly esimService: EsimService) {}

  @Get('packages')
  async getPackages(
    @Query('region') region?: string,
    @Query('type') type?: 'local' | 'global',
  ) {
    const targetRegion = region || 'global';
    return this.esimService.getPackages(targetRegion, type);
  }

  @Get('admin/orders')
  async getAdminOrders() {
    return this.esimService.getAdminOrders();
  }

  @Post('admin/sync-packages')
  async syncPackages() {
    return this.esimService.syncPackagesCatalog();
  }

  @Post('admin/webhooks/opt-in')
  async optInWebhooks(@Body() body: { webhookUrl: string }) {
    const url = body.webhookUrl || 'https://api.dellicstravels.com/webhooks/airalo';
    return this.esimService.optInWebhooks(url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('order')
  async createOrder(@Req() req: Request, @Body() body: { packageId: string }) {
    const user = req.user as any;
    // In a real app, we extract user ID from the JWT token.
    // For this prototype, we'll use a dummy ID if user is missing, or the ID from token
    const userId = user?.id || 'dummy-user-id';
    return this.esimService.initiateOrder(userId, body.packageId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async getOrders(@Req() req: Request) {
    const user = req.user as any;
    const userId = user?.id || 'dummy-user-id';
    return this.esimService.getOrders(userId);
  }

  @Get('instructions/:iccid')
  async getInstructions(
    @Param('iccid') iccid: string,
    @Query('lang') lang?: string,
  ) {
    return this.esimService.getInstructions(iccid, lang || 'en');
  }
}
