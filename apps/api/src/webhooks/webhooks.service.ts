import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  constructor(private prisma: PrismaService) {}

  async handleStripeWebhook(signature: string, event: any) {
    this.logger.log(`Received Stripe Webhook: ${event.type}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      const payment = await this.prisma.payment.findUnique({
        where: { stripe_payment_intent_id: paymentIntent.id },
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCEEDED' },
        });

        await this.prisma.booking.update({
          where: { id: payment.booking_id },
          data: { status: 'CONFIRMED' },
        });

        this.logger.log(`Booking ${payment.booking_id} confirmed via webhook.`);
      }
    }

    return { received: true };
  }
}
