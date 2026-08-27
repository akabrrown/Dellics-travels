import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface PaystackInitializeOptions {
  email: string;
  amount: number; // in standard currency units (e.g. GHS 100.00 or USD 100.00)
  currency?: string; // GHS, USD, NGN, KES, ZAR (default GHS)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  channels?: string[]; // ['card', 'mobile_money', 'bank', 'ussd', 'qr', 'apple_pay']
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private get paystackSecretKey(): string {
    return this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  private get paystackPublicKey(): string {
    return this.configService.get<string>('PAYSTACK_PUBLIC_KEY') || '';
  }


  private get paystackBaseUrl(): string {
    return (
      this.configService.get<string>('PAYSTACK_BASE_URL') ||
      'https://api.paystack.co'
    );
  }

  // ==========================================
  // PAYSTACK CHECKOUT & INITIALIZATION
  // ==========================================

  /**
   * Initializes a Paystack checkout transaction (Cards, MTN Mobile Money, Telecel Cash, Bank Transfer)
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

    // Paystack amounts are in subunit pesewas / kobo / cents (amount * 100)
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
            currency: currency.toUpperCase(),
            reference: ref,
            callback_url: callbackUrl,
            metadata: metadata || {},
            channels: channels || [
              'card',
              'mobile_money',
              'bank',
              'ussd',
              'qr',
              'apple_pay',
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
              paystack_reference: ref,
              amount,
              currency: currency.toUpperCase(),
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
        publicKey: this.paystackPublicKey,
      };
    } catch (error: any) {
      this.logger.error(`Paystack initialization failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Universal Payment Initialization (replaces Stripe PaymentIntent)
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'GHS',
    bookingId?: string,
    email: string = 'guest@dellicstravels.com',
  ) {
    return this.initializePaystack({
      email,
      amount,
      currency: currency.toUpperCase(),
      metadata: { bookingId: bookingId || 'unknown' },
    });
  }

  // ==========================================
  // TRANSACTION VERIFICATION
  // ==========================================

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

      if (isSuccess) {
        await this.prisma.payment
          .updateMany({
            where: { paystack_reference: reference },
            data: { status: 'SUCCEEDED' },
          })
          .catch(() => null);

        if (tx.metadata?.bookingId && tx.metadata.bookingId !== 'unknown') {
          await this.prisma.booking
            .update({
              where: { id: tx.metadata.bookingId },
              data: { status: 'CONFIRMED' },
            })
            .catch(() => null);
        }
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

  // ==========================================
  // SECURE WEBHOOK PROCESSING (HMAC SHA512)
  // ==========================================

  /**
   * Validates and processes Paystack webhook events
   */
  async handlePaystackWebhook(rawBody: string | Buffer, signature: string) {
    const secret = this.paystackSecretKey;
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

    const hash = crypto
      .createHmac('sha512', secret)
      .update(bodyStr)
      .digest('hex');

    if (hash !== signature) {
      this.logger.warn('Invalid Paystack webhook signature');
      throw new BadRequestException('Invalid signature');
    }

    const payload = JSON.parse(bodyStr);
    this.logger.log(`Received verified Paystack event: ${payload.event}`);

    switch (payload.event) {
      case 'charge.success': {
        const tx = payload.data;
        const reference = tx.reference;
        const bookingId = tx.metadata?.bookingId;

        this.logger.log(`Paystack payment succeeded for ref=${reference}`);

        await this.prisma.payment
          .updateMany({
            where: { paystack_reference: reference },
            data: { status: 'SUCCEEDED' },
          })
          .catch(() => null);

        if (bookingId && bookingId !== 'unknown') {
          await this.prisma.booking
            .update({
              where: { id: bookingId },
              data: { status: 'CONFIRMED' },
            })
            .catch(() => null);
        }
        break;
      }

      case 'refund.processed': {
        const tx = payload.data;
        const reference = tx.transaction_reference;
        if (reference) {
          await this.prisma.payment
            .updateMany({
              where: { paystack_reference: reference },
              data: { status: 'REFUNDED' },
            })
            .catch(() => null);
        }
        break;
      }

      default:
        this.logger.log(`Unhandled Paystack event: ${payload.event}`);
    }

    return { received: true };
  }

  /**
   * Universal Webhook handler (backward compatible alias)
   */
  async handleWebhook(rawBody: string | Buffer, signature: string) {
    return this.handlePaystackWebhook(rawBody, signature);
  }
}
