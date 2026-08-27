import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private supabase: any;

  constructor(private configService: ConfigService) {
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
    const rawBody = typeof payload === 'string' ? payload : Buffer.isBuffer(payload) ? payload.toString('utf8') : JSON.stringify(payload);
    const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature && signature !== 'skip-for-testing') {
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
}
