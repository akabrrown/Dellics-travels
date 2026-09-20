
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  AdminRole,
  AdminTeamMember,
  CreateRoleDto,
  InviteTeamMemberDto,
  PermissionDefinition,
} from './roles.types';

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // Core
  { key: 'dashboard.view', label: 'View Executive Dashboard', category: 'Core', description: 'Access top-level KPI metrics, revenue charts, and operational summary.' },
  { key: 'bookings.view', label: 'View Bookings', category: 'Core', description: 'Inspect flight, hotel, tour, and package reservations.' },
  { key: 'bookings.manage', label: 'Manage & Override Bookings', category: 'Core', description: 'Manually confirm, modify, or cancel reservations.' },
  { key: 'travelers.view', label: 'View Traveler Profiles', category: 'Core', description: 'Read traveler history, passport numbers, and preferences.' },
  { key: 'travelers.manage', label: 'Manage Traveler Profiles', category: 'Core', description: 'Edit customer profile data and loyalty status.' },
  // Content & Commerce
  { key: 'content.view', label: 'View Packages & Destinations', category: 'Content & Commerce', description: 'Browse curated holiday packages and tour catalog.' },
  { key: 'content.create', label: 'Create & Design Packages', category: 'Content & Commerce', description: 'Design custom tours, day itineraries, and components.' },
  { key: 'content.publish', label: 'Publish Packages Live', category: 'Content & Commerce', description: 'Push holiday packages to the public website.' },
  { key: 'content.delete', label: 'Delete Packages', category: 'Content & Commerce', description: 'Remove tour packages from catalog.' },
  { key: 'promotions.manage', label: 'Manage Promo Codes', category: 'Content & Commerce', description: 'Create and activate seasonal discount codes.' },
  { key: 'esims.view', label: 'View eSIM Orders', category: 'Content & Commerce', description: 'Check Airalo eSIM order statuses and ICCIDs.' },
  { key: 'esims.manage', label: 'Reprovision eSIM Orders', category: 'Content & Commerce', description: 'Manually trigger eSIM profile resends.' },
  // Operations & Support
  { key: 'support.view', label: 'View Support Inquiries', category: 'Operations & Support', description: 'Read client inquiries and message threads.' },
  { key: 'support.reply', label: 'Respond to Inquiries', category: 'Operations & Support', description: 'Send official customer responses and quotes.' },
  { key: 'reviews.manage', label: 'Moderate Reviews', category: 'Operations & Support', description: 'Approve, feature, or reject client testimonials.' },
  // Finance & System
  { key: 'finance.view', label: 'View Finance & Reconciliation', category: 'Finance & System', description: 'Inspect Paystack transactions, settlement ledger, and gross revenue.' },
  { key: 'finance.export', label: 'Export Financial Reports', category: 'Finance & System', description: 'Download CSV audit reports and tax statements.' },
  { key: 'refunds.view', label: 'View Refund Queue', category: 'Finance & System', description: 'Read pending refund requests.' },
  { key: 'refunds.approve', label: 'Approve Refunds', category: 'Finance & System', description: 'Trigger Paystack merchant refund settlements.' },
  { key: 'health.view', label: 'View Supplier Health', category: 'Finance & System', description: 'Monitor live latency of GDS, RateHawk, Airalo, and Paystack.' },
  { key: 'analytics.view', label: 'View Analytics & BI', category: 'Finance & System', description: 'Inspect conversion funnels and cohort metrics.' },
  // Administration
  { key: 'membership.manage', label: 'Manage Voyager Club', category: 'Administration', description: 'Grant points, adjust membership tiers.' },
  { key: 'team.view', label: 'View Team & Roles', category: 'Administration', description: 'See admin team member list.' },
  { key: 'team.manage_roles', label: 'Assign & Invite Users', category: 'Administration', description: 'Send admin invitations and change user roles.' },
  { key: 'team.custom_roles', label: 'Manage Custom Roles', category: 'Administration', description: 'Create, edit, and delete custom role definitions.' },
  { key: 'audit.view', label: 'View Audit Log', category: 'Administration', description: 'Read immutable timeline of sensitive admin actions.' },
  { key: 'settings.manage', label: 'Manage Security Settings', category: 'Administration', description: 'Configure 2FA policy, API keys, and company profile.' },
];

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  getPermissions(): PermissionDefinition[] {
    return PERMISSION_CATALOG;
  }

  async getRoles(): Promise<AdminRole[]> {
    const roles = await this.prisma.adminRole.findMany();
    return roles.map(r => ({
      ...r,
      permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions) : r.permissions,
    })) as unknown as AdminRole[];
  }

  async getRoleById(id: string): Promise<AdminRole> {
    const role = await this.prisma.adminRole.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role '${id}' not found.`);
    }
    return {
      ...role,
      permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions,
    } as unknown as AdminRole;
  }

  async createCustomRole(dto: CreateRoleDto): Promise<AdminRole> {
    if (!dto.title) {
      throw new BadRequestException('Role title is required.');
    }

    const id = dto.id || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');

    const existing = await this.prisma.adminRole.findUnique({ where: { id } });
    if (existing) {
      throw new BadRequestException(`A role with identifier '${id}' already exists.`);
    }

    const role = await this.prisma.adminRole.create({
      data: {
        id,
        title: dto.title,
        description: dto.description || 'Custom administrative role.',
        badgeColor: dto.badgeColor || 'bg-slate-100 text-slate-900 border-slate-300',
        isCustom: true,
        permissions: dto.permissions || {},
      }
    });
    this.logger.log(`Created custom role: ${id}`);
    return this.getRoleById(id);
  }

  async updateRole(id: string, dto: Partial<CreateRoleDto>): Promise<AdminRole> {
    const role = await this.getRoleById(id);

    const updatedPermissions = dto.permissions 
      ? { ...role.permissions, ...dto.permissions }
      : role.permissions;

    await this.prisma.adminRole.update({
      where: { id },
      data: {
        title: dto.title !== undefined ? dto.title : role.title,
        description: dto.description !== undefined ? dto.description : role.description,
        badgeColor: dto.badgeColor !== undefined ? dto.badgeColor : role.badgeColor,
        permissions: updatedPermissions,
      }
    });

    this.logger.log(`Updated role: ${id}`);
    return this.getRoleById(id);
  }

  async deleteCustomRole(id: string): Promise<{ success: boolean; message: string }> {
    const role = await this.getRoleById(id);
    if (!role.isCustom) {
      throw new BadRequestException(`Cannot delete built-in system role '${role.title}'.`);
    }

    await this.prisma.user.updateMany({
      where: { admin_role_id: id },
      data: { admin_role_id: 'customer_service' }
    });

    await this.prisma.adminRole.delete({ where: { id } });

    this.logger.log(`Deleted custom role: ${id}`);
    return { success: true, message: `Custom role '${role.title}' deleted successfully.` };
  }

  async deleteRole(id: string): Promise<{ success: boolean; message: string }> {
    return this.deleteCustomRole(id);
  }

  async getTeamMembers(): Promise<AdminTeamMember[]> {
    const dbUsers = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: { admin_role: true },
      orderBy: { updated_at: 'desc' },
    });
    
    return dbUsers.map(u => ({
      id: u.id,
      name: u.name || u.email.split('@')[0],
      email: u.email,
      roleId: u.admin_role_id || 'customer_service',
      roleTitle: u.admin_role?.title || 'Unknown Role',
      status: 'ACTIVE',
      twoFactorEnforced: false,
      lastActive: 'Registered User',
    }));
  }

  async inviteTeamMember(dto: InviteTeamMemberDto): Promise<AdminTeamMember> {
    const role = await this.getRoleById(dto.roleId);
    
    // Check if user already exists
    let user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    
    // Generate secure setup token
    const setupToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(setupToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          role: 'ADMIN',
          admin_role_id: role.id,
          admin_otp_hash: tokenHash,
          admin_otp_expires_at: expiresAt
        }
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'ADMIN',
          admin_role_id: role.id,
          admin_otp_hash: tokenHash,
          admin_otp_expires_at: expiresAt
        }
      });
    }

    // Send email using Resend via fetch
    const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (apiKey) {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://dellics-travels-admin.vercel.app';
      const setupLink = `${adminUrl}/setup-account?email=${encodeURIComponent(dto.email)}&token=${setupToken}`;
      
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invitation to Dellics Travels Admin</h2>
          <p>Hello ${dto.name},</p>
          <p>You have been invited to join the Dellics Travels Administrative Operations portal as a <strong>${role.title}</strong>.</p>
          <p>Please click the button below to securely set your password and access your account. This link will expire in 48 hours.</p>
          <a href="${setupLink}" style="display: inline-block; padding: 12px 24px; background-color: #0A0060; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">Set Up My Account</a>
          <p style="margin-top: 32px; font-size: 12px; color: #666;">If you did not expect this invitation, please ignore this email.</p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Dellics Travels <help@dellicstravels.com>",
          to: [dto.email],
          subject: "Invitation to Dellics Travels Admin",
          html: htmlContent
        }),
      }).catch(err => this.logger.error("Failed to send invite email", err));
    }
    
    this.logger.log(`Invited team member ${user.email} as ${role.title}`);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: role.id,
      roleTitle: role.title,
      status: 'INVITED',
      twoFactorEnforced: false,
      lastActive: 'Invited just now',
    };
  }

  async hasPermission(roleId: string, permissionKey: string): Promise<boolean> {
    if (roleId === 'master_admin') return true;
    try {
      const role = await this.getRoleById(roleId);
      return !!role.permissions[permissionKey];
    } catch {
      return false;
    }
  }

  async updateMemberRole(memberId: string, roleId: string): Promise<AdminTeamMember> {
    const role = await this.getRoleById(roleId);
    
    const dbUser = await this.prisma.user.findUnique({ where: { id: memberId } });
    if (!dbUser) {
       throw new NotFoundException(`User ${memberId} not found`);
    }

    const dbRole = roleId === 'master_admin' ? 'ADMIN' : 'ADMIN';
    const updatedUser = await this.prisma.user.update({
      where: { id: memberId },
      data: { 
        role: dbRole,
        admin_role_id: role.id
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name || updatedUser.email.split('@')[0],
      email: updatedUser.email,
      roleId: role.id,
      roleTitle: role.title,
      status: 'ACTIVE',
      twoFactorEnforced: false,
      lastActive: 'Updated role',
    };
  }
}
