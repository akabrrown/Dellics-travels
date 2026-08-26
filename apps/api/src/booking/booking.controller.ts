import { Controller, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('payment-intent')
  async createPaymentIntent(@Body() body: any) {
    return this.bookingService.createPaymentIntent(body.amount, body.currency, body.metadata);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createBooking(@Req() req: any, @Body() body: any, @Headers('idempotency-key') idempotencyKey: string) {
    if (!idempotencyKey) {
      throw new Error('idempotency-key header is required');
    }
    return this.bookingService.createBooking(body, req.user.id, idempotencyKey);
  }

  @Post('webhook/stripe')
  async stripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    // Note: requires raw body for stripe signature verification
    return this.bookingService.handleStripeWebhook(signature, req.rawBody as unknown as Buffer);
  }
}
