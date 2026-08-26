import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private stripe: Stripe;
  private supabase: any;

  constructor(private configService: ConfigService) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2026-07-29.dahlia' });
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async createPaymentIntent(amount: number, currency: string, metadata: any) {
    if (!this.stripe) {
      throw new HttpException('Stripe is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error.message}`);
      throw new HttpException('Payment service error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBooking(bookingData: any, userId: string, idempotencyKey: string) {
    if (!this.supabase) {
      throw new HttpException('Database is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
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

    // 2. Begin "transaction" via RPC or direct insert
    // For simplicity, we insert sequentially. In a real app we'd use a postgres function for true transactions.
    
    // Insert Booking
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
      throw new HttpException('Failed to create booking', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Insert Guests
    if (bookingData.guests && bookingData.guests.length > 0) {
      const guestsToInsert = bookingData.guests.map((g: any, index: number) => ({
        booking_id: booking.id,
        first_name: g.firstName,
        last_name: g.lastName,
        email: g.email,
        is_primary: index === 0
      }));

      const { error: guestsError } = await this.supabase
        .from('booking_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        this.logger.error(`Failed to insert guests: ${guestsError.message}`);
      }
    }

    return { message: 'Booking created successfully', data: booking };
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!this.stripe || !webhookSecret) {
      throw new HttpException('Webhook not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Update booking status in Supabase
        break;
      case 'payment_intent.payment_failed':
        this.logger.log('Payment failed');
        break;
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
