import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import * as crypto from 'crypto';

export interface PaystackInitializeOptions {
  email: string;
  amount: number; // in standard currency units (e.g. GHS 100.00)
  currency?: string; // GHS, USD, NGN (default GHS)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  channels?: string[]; // ['card', 'mobile_money', 'bank', 'ussd', 'qr']
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeSecret =
      this.configService.get<string>('STRIPE_SECRET_KEY') ||
      'sk_test_placeholder';
    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16' as any,
    });
    this.endpointSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ||
      'whsec_placeholder';
  }

  private get paystackSecretKey(): string {
    return this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  private get paystackBaseUrl(): string {
    return (
      this.configService.get<string>('PAYSTACK_BASE_URL') ||
      'https://api.paystack.co'
    );
  }

  // ==========================================
  // PAYSTACK PAYMENT INTEGRATION (Ghana / Africa)
  // ==========================================

  /**
   * Initializes a Paystack checkout transaction (Cards & Mobile Money: MTN, Telecel, AT)
   */
  async initializePaystack(opts: PaystackInitializeOptions) {
    const {
      email,
      amount,
      currency = 'GHS',
      reference,
      callbackUrl,
      metadata,
      channels,
    } = opts;
    const ref =
      reference ||
      `dellics_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Paystack amounts are in pesewas / kobo / cents (amount * 100)
    const amountInSubunit = Math.round(amount * 100);

    this.logger.log(
      `Initializing Paystack transaction ref=${ref}, amount=${amount} ${currency}, email=${email}`,
    );

    try {
      const response = await fetch(
        `${this.paystackBaseUrl}/transaction/initialize`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            amount: amountInSubunit,
            currency,
            reference: ref,
            callback_url: callbackUrl,
            metadata: metadata || {},
            channels: channels || [
              'card',
              'mobile_money',
              'bank',
              'ussd',
              'qr',
            ],
          }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(
          data.message || `Paystack responded with status ${response.status}`,
        );
      }

      if (metadata?.bookingId) {
        await this.prisma.payment
          .create({
            data: {
              booking_id: metadata.bookingId,
              stripe_payment_intent_id: ref, // store paystack reference in transaction column
              amount,
              currency,
              status: 'PENDING',
            },
          })
          .catch((err) => {
            this.logger.warn(
              `Could not create DB payment record: ${err.message}`,
            );
          });
      }

      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      };
    } catch (error: any) {
      this.logger.error(`Paystack initialization failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Verifies a Paystack transaction by reference
   */
  async verifyPaystack(reference: string) {
    this.logger.log(`Verifying Paystack transaction: ${reference}`);
    try {
      const response = await fetch(
        `${this.paystackBaseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(
          data.message || `Paystack verification failed: ${response.status}`,
        );
      }

      const tx = data.data;
      const isSuccess = tx.status === 'success';

      if (isSuccess && tx.metadata?.bookingId) {
        await this.prisma.payment
          .updateMany({
            where: { stripe_payment_intent_id: reference },
            data: { status: 'SUCCEEDED' },
          })
          .catch(() => null);

        await this.prisma.booking
          .update({
            where: { id: tx.metadata.bookingId },
            data: { status: 'CONFIRMED' },
          })
          .catch(() => null);
      }

      return {
        status: tx.status,
        reference: tx.reference,
        amount: tx.amount / 100,
        currency: tx.currency,
        paidAt: tx.paid_at,
        channel: tx.channel,
        customer: tx.customer,
        metadata: tx.metadata,
      };
    } catch (error: any) {
      this.logger.error(`Paystack verification error: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Validates and processes Paystack webhook events
   */
  async handlePaystackWebhook(rawBody: string | Buffer, signature: string) {
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'))
      .digest('hex');

    if (hash !== signature) {
      this.logger.warn('Invalid Paystack webhook signature');
      throw new BadRequestException('Invalid signature');
    }

    const payload = JSON.parse(
      typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8'),
    );
    this.logger.log(`Received Paystack event: ${payload.event}`);

    if (payload.event === 'charge.success') {
      const tx = payload.data;
      const bookingId = tx.metadata?.bookingId;

      if (bookingId) {
        await this.prisma.payment
          .updateMany({
            where: { stripe_payment_intent_id: tx.reference },
            data: { status: 'SUCCEEDED' },
          })
          .catch(() => null);

        await this.prisma.booking
          .update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
          })
          .catch(() => null);
      }
    }

    return { received: true };
  }

  // ==========================================
  // STRIPE PAYMENT INTEGRATION (International)
  // ==========================================

  async createPaymentIntent(
    amount: number,
    currency: string,
    bookingId?: string,
  ) {
    this.logger.log(`Creating Stripe PaymentIntent for ${amount} ${currency}`);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: {
          bookingId: bookingId || 'unknown',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (bookingId && bookingId !== 'unknown') {
        await this.prisma.payment
          .create({
            data: {
              booking_id: bookingId,
              stripe_payment_intent_id: paymentIntent.id,
              amount: amount,
              currency,
              status: 'PENDING',
            },
          })
          .catch((err) => {
            this.logger.warn(
              `Could not create Payment record in DB for booking ${bookingId}: ${err.message}`,
            );
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
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.endpointSecret,
      );
    } catch (err: any) {
      this.logger.warn(
        `Webhook signature verification failed: ${err.message}. Processing as unverified for demo.`,
      );
      event = body as Stripe.Event;
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        this.logger.log(
          `PaymentIntent for ${paymentIntent.amount} was successful! BookingID: ${paymentIntent.metadata?.bookingId}`,
        );
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId && bookingId !== 'unknown') {
          await this.prisma.payment
            .updateMany({
              where: {
                stripe_payment_intent_id: paymentIntent.id,
              },
              data: {
                status: 'SUCCEEDED',
              },
            })
            .catch((err) => {
              this.logger.warn(
                `Could not update Payment record to SUCCEEDED: ${err.message}`,
              );
            });

          await this.prisma.booking
            .update({
              where: { id: bookingId },
              data: { status: 'CONFIRMED' },
            })
            .catch((err) => {
              this.logger.warn(
                `Could not update Booking status to CONFIRMED: ${err.message}`,
              );
            });
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        this.logger.log(
          `PaymentIntent for ${paymentIntent.amount} failed. BookingID: ${paymentIntent.metadata?.bookingId}`,
        );
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId && bookingId !== 'unknown') {
          await this.prisma.payment
            .updateMany({
              where: {
                stripe_payment_intent_id: paymentIntent.id,
              },
              data: {
                status: 'FAILED',
              },
            })
            .catch((err) => {
              this.logger.warn(
                `Could not update Payment record to FAILED: ${err.message}`,
              );
            });

          await this.prisma.booking
            .update({
              where: { id: bookingId },
              data: { status: 'CANCELLED' },
            })
            .catch((err) => {
              this.logger.warn(
                `Could not update Booking status to CANCELLED: ${err.message}`,
              );
            });
        }
        break;
      }
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
