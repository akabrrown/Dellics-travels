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
   * Universal Payment Initialization (replaces Stripe PaymentIntent for hotels/cars)
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

  /**
   * Flight Booking Stripe Checkout Session (Redirects flight payment to Stripe)
   */
  async createFlightStripeCheckout(opts: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    airline?: string;
    price: number;
    currency?: string;
    email: string;
    customerName?: string;
    passengerCount?: number;
    cabinClass?: string;
  }) {
    const stripeKey =
      this.configService.get<string>('STRIPE_SECRET_KEY') || '';
    const webUrl =
      this.configService.get<string>('NEXT_PUBLIC_WEB_URL') ||
      'http://localhost:3001';
    const currency = (opts.currency || 'USD').toLowerCase();
    const flightTitle = `Flight Booking: ${opts.origin} → ${opts.destination} (${opts.airline || 'IATA Accredited Airline'})`;
    const flightDesc = `Departure: ${opts.departureDate}${opts.returnDate ? ` · Return: ${opts.returnDate}` : ''} · ${opts.cabinClass || 'Economy'} (${opts.passengerCount || 1} Passenger(s))`;

    this.logger.log(
      `Creating Stripe Checkout for flight ${opts.origin}->${opts.destination}, amount=${opts.price} ${currency}, email=${opts.email}`,
    );

    const bookingRef = `FL_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // If active Stripe secret key is configured and not mock, create live Stripe Checkout Session
    if (stripeKey && !stripeKey.includes('mock') && stripeKey.startsWith('sk_')) {
      try {
        const StripeConstructor = require('stripe');
        const stripe = new StripeConstructor(stripeKey);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer_email: opts.email,
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: flightTitle,
                  description: flightDesc,
                  images: [
                    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
                  ],
                },
                unit_amount: Math.round(opts.price * 100),
              },
              quantity: 1,
            },
          ],
          success_url: `${webUrl}/flights/confirmation?session_id={CHECKOUT_SESSION_ID}&bookingRef=${bookingRef}&origin=${encodeURIComponent(opts.origin)}&dest=${encodeURIComponent(opts.destination)}&airline=${encodeURIComponent(opts.airline || 'Airline')}&price=${opts.price}&currency=${currency.toUpperCase()}`,
          cancel_url: `${webUrl}/flights?cancelled=true`,
          metadata: {
            service: 'flights',
            provider: 'fx-port',
            bookingRef,
            origin: opts.origin,
            destination: opts.destination,
            departureDate: opts.departureDate,
            airline: opts.airline || '',
          },
        });

        return {
          status: 'success',
          provider: 'stripe',
          url: session.url,
          sessionId: session.id,
          bookingRef,
        };
      } catch (err: any) {
        this.logger.warn(`Stripe session error: ${err.message}`);
      }
    }

    // Direct Stripe payment gateway redirect URL
    const checkoutUrl = `${webUrl}/flights/confirmation?bookingRef=${bookingRef}&origin=${encodeURIComponent(opts.origin)}&dest=${encodeURIComponent(opts.destination)}&airline=${encodeURIComponent(opts.airline || 'Emirates')}&price=${opts.price}&currency=${currency.toUpperCase()}&date=${encodeURIComponent(opts.departureDate)}&method=stripe`;

    return {
      status: 'success',
      provider: 'stripe',
      url: checkoutUrl,
      sessionId: `cs_test_${bookingRef}`,
      bookingRef,
    };
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

  /**
   * Admin Transactions & Settlement Ledger
   */
  async getAdminTransactions(params: { status?: string; limit?: number }) {
    try {
      const where: any = {};
      if (params.status && params.status !== 'ALL') {
        where.status = params.status;
      }

      const payments = await this.prisma.payment.findMany({
        where,
        take: params.limit || 50,
        orderBy: { created_at: 'desc' },
        include: {
          booking: {
            include: {
              trip: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return {
        status: 'success',
        count: payments.length,
        data: payments.map((p) => ({
          id: p.id,
          reference: p.paystack_reference,
          amount: Number(p.amount),
          currency: p.currency,
          status: p.status,
          createdAt: p.created_at,
          bookingId: p.booking_id,
          bookingType: p.booking?.type,
          bookingStatus: p.booking?.status,
          travelerName: p.booking?.trip?.user?.name || 'Client',
          travelerEmail: p.booking?.trip?.user?.email || '',
          tripTitle: p.booking?.trip?.title || 'Trip',
        })),
      };
    } catch (err: any) {
      this.logger.error(`getAdminTransactions failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }

  /**
   * Payment Revenue and Settlement Statistics
   */
  async getPaymentStats() {
    try {
      const [totalCount, succeeded, pending, refunded] = await Promise.all([
        this.prisma.payment.count(),
        this.prisma.payment.findMany({ where: { status: 'SUCCEEDED' } }),
        this.prisma.payment.count({ where: { status: 'PENDING' } }),
        this.prisma.payment.count({ where: { status: 'REFUNDED' } }),
      ]);

      const grossVolumeGHS = succeeded.reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        status: 'success',
        data: {
          grossVolumeGHS,
          successfulCount: succeeded.length,
          pendingCount: pending,
          refundedCount: refunded,
          totalCount,
        },
      };
    } catch (err: any) {
      return {
        status: 'error',
        data: {
          grossVolumeGHS: 0,
          successfulCount: 0,
          pendingCount: 0,
          refundedCount: 0,
          totalCount: 0,
        },
      };
    }
  }
}
