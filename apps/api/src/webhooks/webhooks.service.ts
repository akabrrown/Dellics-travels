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

  /**
   * Processes verified Airalo webhook notifications
   * Handles sim.activated, sim.installed, sim.exhausted, sim.expired, order.completed
   */
  async handleAiraloWebhook(event: any) {
    const eventType = event.event || event.type || event.action;
    this.logger.log(`Received Airalo Webhook event: ${eventType}`);

    const payload = event.data || event;
    const iccid = payload.iccid || payload.sim?.iccid;

    if (!iccid) {
      this.logger.warn('Airalo webhook received without ICCID identifier.');
      return { received: true, processed: false };
    }

    const order = await this.prisma.eSIMOrder.findFirst({
      where: { iccid },
    });

    if (!order) {
      this.logger.warn(`No matching eSIMOrder found for ICCID: ${iccid}`);
      return { received: true, processed: false };
    }

    switch (eventType) {
      case 'sim.activated':
      case 'sim.installed':
        await this.prisma.eSIMOrder.update({
          where: { id: order.id },
          data: { status: 'ACTIVE' },
        });
        this.logger.log(`eSIM ${iccid} transitioned to ACTIVE.`);
        break;

      case 'sim.exhausted':
      case 'sim.expired':
        await this.prisma.eSIMOrder.update({
          where: { id: order.id },
          data: { status: 'EXPIRED' },
        });
        this.logger.log(`eSIM ${iccid} marked as EXPIRED/EXHAUSTED.`);
        break;

      case 'order.completed':
        await this.prisma.eSIMOrder.update({
          where: { id: order.id },
          data: { status: 'PROVISIONED' },
        });
        this.logger.log(`eSIM ${iccid} confirmed PROVISIONED.`);
        break;

      default:
        this.logger.log(`Unhandled Airalo event: ${eventType}`);
    }

    return { received: true, processed: true, iccid, eventType };
  }
}
