import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private supabase: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

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

  /**
   * Initializes a Paystack checkout transaction (Mobile Money & Cards)
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'GHS',
    metadata: any = {},
  ) {
    const email = metadata?.guestEmail || metadata?.email || 'guest@dellicstravels.com';
    const ref = `dellics_bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const amountInSubunits = Math.round(amount * 100);

    this.logger.log(
      `Initializing Paystack booking checkout ref=${ref}, amount=${amount} ${currency}, email=${email}`,
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
            amount: amountInSubunits,
            currency: currency.toUpperCase(),
            reference: ref,
            metadata: metadata || {},
            channels: [
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
          data.message || `Paystack initialization failed with status ${response.status}`,
        );
      }

      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
        publicKey: this.paystackPublicKey,
        // Backward-compatible fields for existing mobile hooks
        clientSecret: data.data.reference,
        paymentIntentId: data.data.reference,
      };
    } catch (error: any) {
      this.logger.error(`Error initializing Paystack checkout: ${error.message}`);
      throw new HttpException(
        error.message || 'Payment initialization error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createBooking(
    bookingData: any,
    userId: string,
    idempotencyKey: string,
  ) {
    if (!this.supabase) {
      throw new HttpException(
        'Database is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 1. Check idempotency to prevent double bookings
    const { data: existingBooking } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existingBooking) {
      return { message: 'Booking already exists', data: existingBooking };
    }

    // 2. Insert Booking
    const { data: booking, error: bookingError } = await this.supabase
      .from('bookings')
      .insert({
        user_id: userId,
        type: bookingData.type,
        status: 'PENDING',
        total_amount: bookingData.totalAmount,
        currency: bookingData.currency,
        idempotency_key: idempotencyKey,
      })
      .select()
      .single();

    if (bookingError) {
      this.logger.error(`Booking insertion failed: ${bookingError.message}`);
      throw new HttpException(
        'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Insert Guests
    if (bookingData.guests && bookingData.guests.length > 0) {
      const guestsToInsert = bookingData.guests.map(
        (g: any, index: number) => ({
          booking_id: booking.id,
          first_name: g.firstName,
          last_name: g.lastName,
          email: g.email,
          is_primary: index === 0,
        }),
      );

      const { error: guestsError } = await this.supabase
        .from('booking_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        this.logger.error(`Failed to insert guests: ${guestsError.message}`);
      }
    }

    return { message: 'Booking created successfully', data: booking };
  }

  /**
   * Validates and processes Paystack booking webhook events
   */
  async handlePaystackWebhook(signature: string, payload: Buffer | string | any) {
    if (!signature || !this.paystackSecretKey) {
      this.logger.warn('Paystack webhook received without valid signature or secret key');
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }

    const rawBody = typeof payload === 'string' ? payload : Buffer.isBuffer(payload) ? payload.toString('utf8') : JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    const hashBuf = Buffer.from(hash, 'utf8');
    const sigBuf = Buffer.from(signature, 'utf8');

    if (hashBuf.length !== sigBuf.length || !crypto.timingSafeEqual(hashBuf, sigBuf)) {
      this.logger.warn('Paystack webhook signature verification failed');
      throw new HttpException('Invalid webhook signature', HttpStatus.BAD_REQUEST);
    }

    const event = JSON.parse(rawBody);
    this.logger.log(`Received Paystack event: ${event.event}`);

    if (event.event === 'charge.success') {
      const tx = event.data;
      const bookingId = tx.metadata?.bookingId;

      if (bookingId && this.supabase) {
        await this.supabase
          .from('bookings')
          .update({ status: 'CONFIRMED' })
          .eq('id', bookingId);
        this.logger.log(`Confirmed booking ${bookingId} via Paystack webhook`);
      }
    }

    return { received: true };
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    return this.handlePaystackWebhook(signature, payload);
  }

  /**
   * Admin dashboard metrics & pipeline overview
   */
  async getAdminOverview() {
    try {
      const [total, held, confirmed, completed, cancelled, recentBookings, payments] = await Promise.all([
        this.prisma.booking.count(),
        this.prisma.booking.count({ where: { status: 'HELD' } }),
        this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
        this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
        this.prisma.booking.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          include: {
            trip: {
              include: {
                user: true,
              },
            },
            payments: true,
          },
        }),
        this.prisma.payment.findMany({
          where: { status: 'SUCCEEDED' },
          select: { amount: true, currency: true },
        }),
      ]);

      const totalRevenueGHS = payments.reduce((acc, p) => acc + Number(p.amount), 0);

      return {
        status: 'success',
        data: {
          pipeline: [
            { label: 'Held', count: held, sub: 'Active holds', status: 'HELD' },
            { label: 'Confirmed', count: confirmed, sub: 'Ticketed & active', status: 'CONFIRMED' },
            { label: 'Completed', count: completed, sub: 'Completed trips', status: 'COMPLETED' },
            { label: 'Cancelled', count: cancelled, sub: 'Voided / Cancelled', status: 'CANCELLED' },
          ],
          counts: { total, held, confirmed, completed, cancelled },
          totalRevenueGHS,
          recentBookings: recentBookings.map((b) => ({
            id: b.id,
            type: b.type,
            status: b.status,
            supplierRef: b.supplier_ref,
            travelerName: b.trip?.user?.name || 'Client',
            travelerEmail: b.trip?.user?.email || '',
            membershipTier: b.trip?.user?.membership_tier || 'EXPLORER',
            tripTitle: b.trip?.title || 'Trip',
            createdAt: b.created_at,
            amount: b.payments?.[0]?.amount ? Number(b.payments[0].amount) : 0,
            currency: b.payments?.[0]?.currency || 'USD',
          })),
        },
      };
    } catch (err: any) {
      this.logger.error(`getAdminOverview failed: ${err.message}`);
      return {
        status: 'error',
        data: {
          pipeline: [],
          counts: { total: 0, held: 0, confirmed: 0, completed: 0, cancelled: 0 },
          totalRevenueGHS: 0,
          recentBookings: [],
        },
      };
    }
  }

  /**
   * Admin paginated bookings list with search and filters
   */
  async getAdminBookings(params: { status?: string; type?: string; search?: string; limit?: number }) {
    try {
      const where: any = {};
      if (params.status && params.status !== 'ALL') {
        where.status = params.status;
      }
      if (params.type && params.type !== 'ALL') {
        where.type = params.type;
      }
      if (params.search) {
        where.OR = [
          { id: { contains: params.search, mode: 'insensitive' } },
          { supplier_ref: { contains: params.search, mode: 'insensitive' } },
          { trip: { title: { contains: params.search, mode: 'insensitive' } } },
          { trip: { user: { name: { contains: params.search, mode: 'insensitive' } } } },
          { trip: { user: { email: { contains: params.search, mode: 'insensitive' } } } },
        ];
      }

      const bookings = await this.prisma.booking.findMany({
        where,
        take: params.limit || 50,
        orderBy: { created_at: 'desc' },
        include: {
          trip: {
            include: {
              user: true,
            },
          },
          payments: true,
        },
      });

      return {
        status: 'success',
        count: bookings.length,
        data: bookings.map((b) => ({
          id: b.id,
          type: b.type,
          status: b.status,
          supplierRef: b.supplier_ref,
          travelerName: b.trip?.user?.name || 'Client',
          travelerEmail: b.trip?.user?.email || '',
          travelerPhone: b.trip?.user?.phone || '',
          membershipTier: b.trip?.user?.membership_tier || 'EXPLORER',
          tripTitle: b.trip?.title || 'Trip',
          startDate: b.trip?.start_date,
          endDate: b.trip?.end_date,
          createdAt: b.created_at,
          paymentStatus: b.payments?.[0]?.status || 'PENDING',
          paymentReference: b.payments?.[0]?.paystack_reference || null,
          amount: b.payments?.[0]?.amount ? Number(b.payments[0].amount) : 0,
          currency: b.payments?.[0]?.currency || 'USD',
        })),
      };
    } catch (err: any) {
      this.logger.error(`getAdminBookings failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }

  /**
   * Admin pending & processed refunds
   */
  async getAdminRefunds() {
    try {
      const refunds = await this.prisma.payment.findMany({
        where: { status: 'REFUNDED' },
        take: 50,
        orderBy: { updated_at: 'desc' },
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
        count: refunds.length,
        data: refunds.map((r) => ({
          id: r.id,
          reference: r.paystack_reference,
          amount: Number(r.amount),
          currency: r.currency,
          status: r.status,
          updatedAt: r.updated_at,
          bookingId: r.booking_id,
          bookingType: r.booking?.type,
          travelerName: r.booking?.trip?.user?.name || 'Client',
          travelerEmail: r.booking?.trip?.user?.email || '',
          tripTitle: r.booking?.trip?.title || 'Trip',
        })),
      };
    } catch (err: any) {
      this.logger.error(`getAdminRefunds failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }
}
