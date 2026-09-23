import { AuthTokenService } from './auth-token.service';
import * as crypto from 'crypto';
import { Controller, Post, Get, Body, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { AdminLoginInitDto, AdminLoginDto, ChangePasswordDto, SetupAccountDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly tokenService: AuthTokenService) {}

  @Post('admin/login-init')
  async adminLoginInit(
    @Body() body: AdminLoginInitDto,
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    let isPasswordValid = false;
    const hash = user.password_hash || '';
    if (hash.includes(':') && !hash.startsWith('$2')) {
       const crypto = require('crypto');
       const [salt, expectedHex] = hash.split(':');
       if (salt && expectedHex) {
           const expectedBuffer = Buffer.from(expectedHex, "hex");
           const derivedBuffer = crypto.scryptSync(body.password, salt, 64);
           isPasswordValid = crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
       }
    } else {
       isPasswordValid = await bcrypt.compare(body.password, hash);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        admin_otp_hash: otpHash,
        admin_otp_expires_at: expiresAt,
      }
    });

    const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (apiKey) {
      const { buildAdminOtpHtml } = require('./email');
      const html = buildAdminOtpHtml({ name: user.name, otpCode: otp });
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Dellics Travels <support@dellicstravels.com>",
          to: [user.email],
          subject: "Your Dellics Admin Login Code",
          html,
        }),
      }).catch(err => console.error("Failed to send OTP email", err));
    } else {
      console.log(`[DEV OTP] Code for ${user.email} is ${otp}`);
    }

    return { status: 'success', requireOtp: true };
  }

  @Post('admin/login')
  async adminLogin(
    @Body() body: AdminLoginDto,
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || user.role !== 'ADMIN' || !user.admin_role_id) {
      throw new UnauthorizedException('Access Denied: Unrecognized operations account.');
    }

    if (!body.password) {
      throw new UnauthorizedException('Password is required.');
    }
    
    let isPasswordValid = false;
    const hash = user.password_hash || '';
    if (hash.includes(':') && !hash.startsWith('$2')) {
       const crypto = require('crypto');
       const [salt, expectedHex] = hash.split(':');
       if (salt && expectedHex) {
           const expectedBuffer = Buffer.from(expectedHex, "hex");
           const derivedBuffer = crypto.scryptSync(body.password, salt, 64);
           isPasswordValid = crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
       }
    } else {
       isPasswordValid = await bcrypt.compare(body.password, hash);
    }
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!body.otp) {
      throw new UnauthorizedException('OTP Code is required.');
    }

    if (!user.admin_otp_hash || !user.admin_otp_expires_at || user.admin_otp_expires_at < new Date()) {
      throw new UnauthorizedException('OTP expired or invalid. Please request a new one.');
    }

    const isOtpValid = await bcrypt.compare(body.otp, user.admin_otp_hash);
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP code.');
    }

    // Clear OTP after successful use
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        admin_otp_hash: null,
        admin_otp_expires_at: null,
      }
    });

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
        otpEnabled: true,
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
          otpEnabled: true,
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

  @UseGuards(AdminAuthGuard)
  @Post('admin/change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '').trim();
    const payload = this.tokenService.verifyAdminToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid session.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new UnauthorizedException('Account not found.');
    }

    if (!user.password_hash) {
      throw new UnauthorizedException('No password set. Contact your administrator.');
    }

    const isCurrentValid = await bcrypt.compare(body.currentPassword, user.password_hash);
    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const newHash = await bcrypt.hash(body.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    });

    return { status: 'success', message: 'Password updated successfully.' };
  }


  @Post('admin/setup-account')
  async setupAccount(@Body() body: SetupAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user || user.role !== 'ADMIN') {
      throw new UnauthorizedException('Account not found.');
    }

    if (!user.admin_otp_hash || !user.admin_otp_expires_at) {
      throw new UnauthorizedException('Invalid or expired setup token.');
    }

    if (new Date() > user.admin_otp_expires_at) {
      throw new UnauthorizedException('Setup link has expired.');
    }

    const tokenHash = crypto.createHash('sha256').update(body.token).digest('hex');
    if (tokenHash !== user.admin_otp_hash) {
      throw new UnauthorizedException('Invalid setup token.');
    }

    const newHash = await bcrypt.hash(body.newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        password_hash: newHash,
        admin_otp_hash: null,
        admin_otp_expires_at: null
      },
    });

    return { status: 'success', message: 'Account setup successfully.' };
  }

}
