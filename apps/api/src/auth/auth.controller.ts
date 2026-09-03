import { Controller, Post, Get, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('sync')
  async syncUser(
    @Body() body: { id: string; name: string; email: string; phone: string },
  ) {
    try {
      // 1. Sync to Prisma User table
      const existing = await this.prisma.user.findUnique({
        where: { id: body.id },
      });
      if (!existing) {
        await this.prisma.user.create({
          data: {
            id: body.id,
            name: body.name,
            email: body.email,
            phone: body.phone || null,
            role: 'USER',
            membership_tier: 'EXPLORER',
          },
        });
      }

      // 2. Update Supabase auth.users to set the primary phone number
      // This allows the user to log in using their phone number & password
      if (body.phone && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL ||
            'https://lmmhzqrulehhwgklkahw.supabase.co',
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        );

        const { error: updateError } =
          await supabaseAdmin.auth.admin.updateUserById(body.id, {
            phone: body.phone,
            phone_confirm: true,
          });

        if (updateError) {
          console.error(
            'Failed to set primary phone on Supabase auth.users:',
            updateError,
          );
        }
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error syncing user:', error);
      return { success: false, error: error.message };
    }
  }

  @Get('admin/users')
  @Post('admin/users')
  async getAdminUsers() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        take: 100,
        include: {
          trips: {
            include: {
              bookings: true,
            },
          },
        },
      });

      return {
        status: 'success',
        count: users.length,
        data: users.map((u) => {
          const totalBookings = u.trips.reduce((acc, t) => acc + t.bookings.length, 0);
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            membershipTier: u.membership_tier,
            pointsBalance: u.points_balance,
            nationality: u.nationality,
            homeAirport: u.home_airport,
            passportNumber: u.passport_number
              ? `${u.passport_number.slice(0, 2)}****${u.passport_number.slice(-2)}`
              : null,
            passportExpiry: u.passport_expiry,
            passportCountry: u.passport_country,
            onboardingCompleted: u.onboarding_completed,
            totalTrips: u.trips.length,
            totalBookings,
            createdAt: u.created_at,
          };
        }),
      };
    } catch (err: any) {
      return { status: 'error', count: 0, data: [], message: err.message };
    }
  }
}
