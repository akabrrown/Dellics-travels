import { AuthTokenService } from './auth-token.service';
import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

const PROVISIONED_ADMIN_TEAM = [
  {
    id: 'ADM-001',
    name: 'Kwabena Osei',
    email: 'ops@dellicstravels.com',
    roleId: 'master_admin',
    roleTitle: 'Master Admin',
  },
  {
    id: 'ADM-001-ALT',
    name: 'Kwabena Osei',
    email: 'kwabena.o@dellicstravels.com',
    roleId: 'master_admin',
    roleTitle: 'Master Admin',
  },
  {
    id: 'ADM-002',
    name: 'Akosua Mensah',
    email: 'akosua.m@dellicstravels.com',
    roleId: 'supervisor',
    roleTitle: 'Operations Supervisor',
  },
  {
    id: 'ADM-003',
    name: 'Emmanuel Tetteh',
    email: 'emmanuel.t@dellicstravels.com',
    roleId: 'customer_service',
    roleTitle: 'Customer Service Lead',
  },
  {
    id: 'ADM-004',
    name: 'Abena Frimpong',
    email: 'abena.f@dellicstravels.com',
    roleId: 'finance_team',
    roleTitle: 'Finance & Reconciliation',
  },
];

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly tokenService: AuthTokenService) {}

  @Post('admin/login')
  async adminLogin(
    @Body() body: { email: string; password?: string; totp?: string },
  ) {
    const cleanEmail = (body.email || '').trim().toLowerCase();
    const member = PROVISIONED_ADMIN_TEAM.find(
      (m) => m.email.toLowerCase() === cleanEmail,
    );

    if (!member) {
      throw new UnauthorizedException(
        'Access Denied: Unrecognized operations account.',
      );
    }

    const token = this.tokenService.generateAdminToken({
      id: member.id,
      email: member.email,
      roleId: member.roleId,
    });

    return {
      status: 'success',
      token,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        roleId: member.roleId,
        roleTitle: member.roleTitle,
        totpEnrolled: true,
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

      const member = PROVISIONED_ADMIN_TEAM.find(
        (m) =>
          m.id === payload.id ||
          m.email.toLowerCase() === payload.email.toLowerCase(),
      );

      if (!member) {
        throw new UnauthorizedException('Session account no longer active.');
      }

      return {
        status: 'success',
        user: {
          id: member.id,
          name: member.name,
          email: member.email,
          roleId: member.roleId,
          roleTitle: member.roleTitle,
          totpEnrolled: true,
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
      if (body.phone && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL ||
            'https://gfypumkjomlvvpiiwdfq.supabase.co',
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
          const totalBookings = u.trips.reduce(
            (acc, t) => acc + t.bookings.length,
            0,
          );
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
