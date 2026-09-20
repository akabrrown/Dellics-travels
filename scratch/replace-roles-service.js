const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/roles/roles.service.ts');

const newContent = `
import { PrismaService } from '../prisma/prisma.service';
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
      throw new NotFoundException(\`Role '\${id}' not found.\`);
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
      throw new BadRequestException(\`A role with identifier '\${id}' already exists.\`);
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
    this.logger.log(\`Created custom role: \${id}\`);
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

    this.logger.log(\`Updated role: \${id}\`);
    return this.getRoleById(id);
  }

  async deleteCustomRole(id: string): Promise<{ success: boolean; message: string }> {
    const role = await this.getRoleById(id);
    if (!role.isCustom) {
      throw new BadRequestException(\`Cannot delete built-in system role '\${role.title}'.\`);
    }

    await this.prisma.user.updateMany({
      where: { admin_role_id: id },
      data: { admin_role_id: 'customer_service' }
    });

    await this.prisma.adminRole.delete({ where: { id } });

    this.logger.log(\`Deleted custom role: \${id}\`);
    return { success: true, message: \`Custom role '\${role.title}' deleted successfully.\` };
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
    
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: 'ADMIN',
        admin_role_id: role.id
      }
    });
    
    this.logger.log(\`Invited team member \${newUser.email} as \${role.title}\`);
    
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
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
       throw new NotFoundException(\`User \${memberId} not found\`);
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
`;

fs.writeFileSync(file, newContent);
console.log("Replaced roles.service.ts");
