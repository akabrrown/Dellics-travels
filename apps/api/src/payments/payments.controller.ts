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
  // PAYSTACK CHECKOUT (Mobile Money & Cards)
  // ==========================================

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
        'Email and amount are required for Paystack checkout',
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

  @Get('paystack/verify/:reference')
  async verifyPaystack(@Param('reference') reference: string) {
    if (!reference) {
      throw new BadRequestException('Transaction reference is required');
    }
    return this.paymentsService.verifyPaystack(reference);
  }

  @Post('paystack/webhook')
  async handlePaystackWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing x-paystack-signature header');
    }
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    return this.paymentsService.handlePaystackWebhook(rawBody, signature);
  }

  // ==========================================
  // STRIPE CHECKOUT (International Fallback)
  // ==========================================

  @Post('create-intent')
  async createPaymentIntent(
    @Body()
    createIntentDto: {
      amount: number;
      currency?: string;
      bookingId?: string;
    },
  ) {
    if (!createIntentDto.amount) {
      throw new BadRequestException('Amount is required');
    }
    return this.paymentsService.createPaymentIntent(
      createIntentDto.amount,
      createIntentDto.currency || 'usd',
      createIntentDto.bookingId,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    return this.paymentsService.handleWebhook(req.body, signature);
  }
}
