import { AuthTokenService } from './auth-token.service';
import { Controller, Post, Get, Body, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly tokenService: AuthTokenService) {}

  @Post('admin/login')
  async adminLogin(
    @Body() body: { email: string; password?: string; totp?: string },
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    
    // Fetch from real database
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    // Verify Password
    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Verify TOTP
    if (user.totp_enabled) {
      if (!body.totp) {
        throw new UnauthorizedException('TOTP Code is required.');
      }
      
      const isTotpValid = authenticator.verify({
        token: body.totp,
        secret: user.totp_secret || '',
      });
      
      if (!isTotpValid) {
        throw new UnauthorizedException('Invalid or expired 2FA code.');
      }
    }

    // Generate Final Token
    const token = this.tokenService.generateAdminToken({
      id: user.id,
      email: user.email,
      roleId: user.admin_role_id,
    });

    return {
      status: 'success',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.admin_role_id,
        roleTitle: user.admin_role_id,
        totpEnrolled: user.totp_enabled,
      },
    };
  }

  @Get('admin/me')
  async adminMe(@Headers('authorization') authHeader?: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authentication token required.');
      }

      const token = authHeader.replace('Bearer ', '').trim();
      const payload = this.tokenService.verifyAdminToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired operations token.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user || user.role !== 'ADMIN') {
        throw new UnauthorizedException('Session account no longer active.');
      }

      return {
        status: 'success',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.admin_role_id,
          roleTitle: user.admin_role_id,
          totpEnrolled: user.totp_enabled,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid session token payload.');
    }
  }

  @Post('sync')
  async syncUser(
    @Body() body: { id: string; name: string; email: string; phone: string },
  ) {
    try {
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

      if (body.phone && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL || 'https://gfypumkjomlvvpiiwdfq.supabase.co',
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        );

        await supabaseAdmin.auth.admin.updateUserById(body.id, {
          phone: body.phone,
          phone_confirm: true,
        });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/users')
  @Post('admin/users')
  async getAdminUsers() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        take: 100,
        include: { trips: { include: { bookings: true } } },
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
            passportNumber: u.passport_number ? `${u.passport_number.slice(0, 2)}****${u.passport_number.slice(-2)}` : null,
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
