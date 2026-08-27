import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  constructor(private prisma: PrismaService) {}

  /**
   * Processes verified Paystack webhook payloads
   */
  async handlePaystackWebhook(signature: string, event: any) {
    const eventType = event.event || event.type;
    this.logger.log(`Received Webhook event: ${eventType}`);

    if (eventType === 'charge.success') {
      const tx = event.data;
      const reference = tx.reference || tx.id;
      const bookingId = tx.metadata?.bookingId;

      this.logger.log(`Processing charge.success for ref=${reference}`);

      const payment = await this.prisma.payment.findUnique({
        where: { paystack_reference: reference },
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

        this.logger.log(`Booking ${payment.booking_id} confirmed via Paystack webhook.`);
      } else if (bookingId && bookingId !== 'unknown') {
        await this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' },
        }).catch(() => null);
      }
    }

    return { received: true };
  }

  /**
   * Backward compatible alias
   */
  async handleStripeWebhook(signature: string, event: any) {
    return this.handlePaystackWebhook(signature, event);
  }
}
