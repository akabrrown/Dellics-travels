import {
  Controller,
  Get,
  Post,
  Query,
  Body,
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
  async getPackages(@Query('region') region: string) {
    const targetRegion = region || 'global';
    return this.esimService.getPackages(targetRegion);
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
}
