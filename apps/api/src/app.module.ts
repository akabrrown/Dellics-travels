import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { BookingModule } from './booking/booking.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { PaymentsModule } from './payments/payments.module';
import { EsimModule } from './esim/esim.module';
import { HotelsModule } from './hotels/hotels.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ToursModule } from './tours/tours.module';
import { RolesModule } from './roles/roles.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    SearchModule,
    BookingModule,
    WebhooksModule,
    PaymentsModule,
    EsimModule,
    HotelsModule,
    InquiriesModule,
    ToursModule,
    RolesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
