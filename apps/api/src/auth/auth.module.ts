import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthTokenService } from './auth-token.service';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [PassportModule, PrismaModule, forwardRef(() => RolesModule)],
  controllers: [AuthController],
  providers: [SupabaseStrategy, AuthTokenService, AdminAuthGuard, PermissionsGuard],
  exports: [SupabaseStrategy, AuthTokenService, AdminAuthGuard, PermissionsGuard],
})
export class AuthModule {}
