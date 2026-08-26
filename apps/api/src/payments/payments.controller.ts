import { Controller, Post, Body, Req, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() createIntentDto: { amount: number; currency?: string; bookingId?: string }) {
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
  async handleWebhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    return this.paymentsService.handleWebhook(req.body, signature);
  }
}
