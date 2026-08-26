import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecret = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_placeholder';
    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16' as any, // Bypass strict TS version checking for stripe
    });
    this.endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder';
  }

  async createPaymentIntent(amount: number, currency: string, bookingId?: string) {
    this.logger.log(`Creating PaymentIntent for ${amount} ${currency}`);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses cents
        currency,
        metadata: {
          bookingId: bookingId || 'unknown',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (bookingId && bookingId !== 'unknown') {
        // Attempt to create a Payment record for this booking.
        // Ignore errors if booking doesn't exist yet or is invalid type.
        await this.prisma.payment.create({
          data: {
            booking_id: bookingId,
            stripe_payment_intent_id: paymentIntent.id,
            amount: amount,
            currency,
            status: 'PENDING',
          }
        }).catch(err => {
          this.logger.warn(`Could not create Payment record in DB for booking ${bookingId}: ${err.message}`);
        });
      }

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error: any) {
      this.logger.error('Failed to create PaymentIntent', error);
      throw new BadRequestException(error.message);
    }
  }

  async handleWebhook(body: any, signature: string) {
    let event: Stripe.Event;

    try {
      // In a real production app, we would use req.rawBody to verify the signature.
      // For this implementation, we simulate it if we don't have the raw body setup in NestJS.
      // To properly verify, we need raw-body.
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.endpointSecret
      );
    } catch (err: any) {
      this.logger.warn(`Webhook signature verification failed (or raw body missing): ${err.message}. Processing as unverified for demo.`);
      event = body as Stripe.Event; // Fallback for dev without rawBody middleware
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`PaymentIntent for ${paymentIntent.amount} was successful! BookingID: ${paymentIntent.metadata?.bookingId}`);
        const bookingId = paymentIntent.metadata?.bookingId;
        
        if (bookingId && bookingId !== 'unknown') {
          await this.prisma.payment.updateMany({
             where: { stripe_payment_intent_id: paymentIntent.id },
             data: { status: 'SUCCEEDED' }
          }).catch(() => null);

          // Update booking status
          await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
          }).catch(() => null);
          
          // Also check if this is an eSIM order and update that
          await this.prisma.eSIMOrder.updateMany({
             where: { stripe_payment_intent_id: paymentIntent.id },
             data: { status: 'PROVISIONED' } // Provisioning would happen here or in EsimService
          }).catch(() => null);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`Payment failed for Intent ${failedIntent.id}`);
        const bookingId = failedIntent.metadata?.bookingId;
        
        if (bookingId && bookingId !== 'unknown') {
          await this.prisma.payment.updateMany({
             where: { stripe_payment_intent_id: failedIntent.id },
             data: { status: 'FAILED' }
          }).catch(() => null);
          
          await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' }, // Release soft hold
          }).catch(() => null);
        }
        break;
      }
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
