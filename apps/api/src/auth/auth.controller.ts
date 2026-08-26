import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('sync')
  async syncUser(@Body() body: { id: string, name: string, email: string, phone: string }) {
    try {
      // 1. Sync to Prisma User table
      const existing = await this.prisma.user.findUnique({ where: { id: body.id } });
      if (!existing) {
        await this.prisma.user.create({
          data: {
            id: body.id,
            name: body.name,
            email: body.email,
            phone: body.phone || null,
            role: 'USER',
            membership_tier: 'EXPLORER'
          }
        });
      }

      // 2. Update Supabase auth.users to set the primary phone number
      // This allows the user to log in using their phone number & password
      if (body.phone && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabaseAdmin = createClient(
          process.env.SUPABASE_URL || 'https://lmmhzqrulehhwgklkahw.supabase.co',
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(body.id, {
          phone: body.phone,
          phone_confirm: true
        });
        
        if (updateError) {
          console.error('Failed to set primary phone on Supabase auth.users:', updateError);
        }
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error syncing user:', error);
      return { success: false, error: error.message };
    }
  }
}
