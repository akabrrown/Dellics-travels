import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ==========================================
  // PAYSTACK CHECKOUT (Cards & Mobile Money)
  // ==========================================

  @Post('initialize')
  @Post('paystack/initialize')
  async initializePaystack(
    @Body()
    body: {
      email: string;
      amount: number;
      currency?: string;
      reference?: string;
      callbackUrl?: string;
      bookingId?: string;
      channels?: string[];
    },
  ) {
    if (!body.email || !body.amount) {
      throw new BadRequestException(
        'Email and amount are required for payment initialization',
      );
    }
    return this.paymentsService.initializePaystack({
      email: body.email,
      amount: body.amount,
      currency: body.currency || 'GHS',
      reference: body.reference,
      callbackUrl: body.callbackUrl,
      metadata: { bookingId: body.bookingId },
      channels: body.channels,
    });
  }

  @Get('verify/:reference')
  @Get('paystack/verify/:reference')
  async verifyPaystack(@Param('reference') reference: string) {
    if (!reference) {
      throw new BadRequestException('Transaction reference is required');
    }
    return this.paymentsService.verifyPaystack(reference);
  }

  @Post('webhook')
  @Post('paystack/webhook')
  async handlePaystackWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') paystackSig: string,
    @Headers('stripe-signature') stripeSig: string,
  ) {
    const signature = paystackSig || stripeSig;
    if (!signature) {
      throw new BadRequestException('Missing payment signature header');
    }
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    return this.paymentsService.handlePaystackWebhook(rawBody, signature);
  }

  /**
   * Compatibility endpoint for mobile / web checkout
   */
  @Post('create-intent')
  async createPaymentIntent(
    @Body()
    body: {
      amount: number;
      currency?: string;
      bookingId?: string;
      email?: string;
    },
  ) {
    if (!body.amount) {
      throw new BadRequestException('Amount is required');
    }
    return this.paymentsService.createPaymentIntent(
      body.amount,
      body.currency || 'GHS',
      body.bookingId,
      body.email || 'guest@dellicstravels.com',
    );
  }
}
