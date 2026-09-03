import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminRole, AdminTeamMember, CreateRoleDto, InviteTeamMemberDto, PermissionDefinition } from './roles.types';

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // Core
  { key: 'dashboard.view', label: 'View Executive Dashboard', category: 'Core', description: 'Access top-level KPI metrics, revenue charts, and operational summary.' },
  { key: 'bookings.view', label: 'View Bookings', category: 'Core', description: 'Inspect flight, hotel, tour, and package reservations.' },
  { key: 'bookings.manage', label: 'Manage & Override Bookings', category: 'Core', description: 'Manually confirm, modify, or cancel reservations.' },
  { key: 'travelers.view', label: 'View Traveler Profiles', category: 'Core', description: 'Read traveler history, passport numbers, and preferences.' },
  { key: 'travelers.manage', label: 'Manage Traveler Profiles', category: 'Core', description: 'Edit customer profile data and loyalty status.' },

  // Content & Commerce
  { key: 'content.view', label: 'View Content & Packages', category: 'Content & Commerce', description: 'Browse curated holiday packages and tour catalog.' },
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

export const INITIAL_ROLES: AdminRole[] = [
  {
    id: 'master_admin',
    title: 'Master Admin',
    description: 'Unrestricted root access to all system modules, finances, custom roles, and security policies.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    isCustom: false,
    permissions: PERMISSION_CATALOG.reduce((acc, p) => ({ ...acc, [p.key]: true }), {}),
  },
  {
    id: 'supervisor',
    title: 'Operations Supervisor',
    description: 'Operational team lead: oversees bookings, publishes tours/content, manages customer escalations and reviews.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    isCustom: false,
    permissions: {
      'dashboard.view': true,
      'bookings.view': true,
      'bookings.manage': true,
      'travelers.view': true,
      'travelers.manage': true,
      'content.view': true,
      'content.create': true,
      'content.publish': true,
      'content.delete': false,
      'promotions.manage': true,
      'esims.view': true,
      'esims.manage': true,
      'support.view': true,
      'support.reply': true,
      'reviews.manage': true,
      'finance.view': false,
      'finance.export': false,
      'refunds.view': true,
      'refunds.approve': false,
      'health.view': true,
      'analytics.view': true,
      'membership.manage': true,
      'team.view': true,
      'team.manage_roles': false,
      'team.custom_roles': false,
      'audit.view': false,
      'settings.manage': false,
    },
  },
  {
    id: 'customer_service',
    title: 'Customer Service Lead',
    description: 'Client front desk: manages support inquiries, traveler bookings assistance, review responses, and eSIM delivery.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    isCustom: false,
    permissions: {
      'dashboard.view': true,
      'bookings.view': true,
      'bookings.manage': false,
      'travelers.view': true,
      'travelers.manage': false,
      'content.view': false,
      'content.create': false,
      'content.publish': false,
      'content.delete': false,
      'promotions.manage': false,
      'esims.view': true,
      'esims.manage': false,
      'support.view': true,
      'support.reply': true,
      'reviews.manage': true,
      'finance.view': false,
      'finance.export': false,
      'refunds.view': true,
      'refunds.approve': false,
      'health.view': false,
      'analytics.view': false,
      'membership.manage': false,
      'team.view': false,
      'team.manage_roles': false,
      'team.custom_roles': false,
      'audit.view': false,
      'settings.manage': false,
    },
  },
  {
    id: 'finance_team',
    title: 'Finance & Reconciliation',
    description: 'Accounting specialist: manages Paystack reconciliations, payment settlements, refunds queue, and revenue reports.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    isCustom: false,
    permissions: {
      'dashboard.view': true,
      'bookings.view': true,
      'bookings.manage': false,
      'travelers.view': false,
      'travelers.manage': false,
      'content.view': false,
      'content.create': false,
      'content.publish': false,
      'content.delete': false,
      'promotions.manage': false,
      'esims.view': false,
      'esims.manage': false,
      'support.view': false,
      'support.reply': false,
      'reviews.manage': false,
      'finance.view': true,
      'finance.export': true,
      'refunds.view': true,
      'refunds.approve': true,
      'health.view': false,
      'analytics.view': true,
      'membership.manage': false,
      'team.view': false,
      'team.manage_roles': false,
      'team.custom_roles': false,
      'audit.view': false,
      'settings.manage': false,
    },
  },
];

export const INITIAL_TEAM_MEMBERS: AdminTeamMember[] = [
  {
    id: 'ADM-001',
    name: 'Kwabena Osei',
    email: 'kwabena.o@dellicstravels.com',
    roleId: 'master_admin',
    roleTitle: 'Master Admin',
    status: 'ACTIVE',
    twoFactorEnforced: true,
    lastActive: 'Active now',
  },
  {
    id: 'ADM-002',
    name: 'Akosua Mensah',
    email: 'akosua.m@dellicstravels.com',
    roleId: 'supervisor',
    roleTitle: 'Operations Supervisor',
    status: 'ACTIVE',
    twoFactorEnforced: true,
    lastActive: '25 mins ago',
  },
  {
    id: 'ADM-003',
    name: 'Emmanuel Tetteh',
    email: 'emmanuel.t@dellicstravels.com',
    roleId: 'customer_service',
    roleTitle: 'Customer Service Lead',
    status: 'ACTIVE',
    twoFactorEnforced: true,
    lastActive: '2 hours ago',
  },
  {
    id: 'ADM-004',
    name: 'Abena Frimpong',
    email: 'abena.f@dellicstravels.com',
    roleId: 'finance_team',
    roleTitle: 'Finance & Reconciliation',
    status: 'ACTIVE',
    twoFactorEnforced: true,
    lastActive: 'Yesterday',
  },
];

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  private roles: AdminRole[] = [...INITIAL_ROLES];
  private teamMembers: AdminTeamMember[] = [...INITIAL_TEAM_MEMBERS];

  /**
   * Get all permission definitions
   */
  getPermissions(): PermissionDefinition[] {
    return PERMISSION_CATALOG;
  }

  /**
   * Get all roles (standard + custom)
   */
  getRoles(): AdminRole[] {
    return this.roles;
  }

  /**
   * Get role by ID
   */
  getRoleById(id: string): AdminRole {
    const role = this.roles.find((r) => r.id === id);
    if (!role) {
      throw new NotFoundException(`Role '${id}' not found.`);
    }
    return role;
  }

  /**
   * Create a new custom role
   */
  createCustomRole(dto: CreateRoleDto): AdminRole {
    if (!dto.title) {
      throw new BadRequestException('Role title is required.');
    }

    const id =
      dto.id ||
      dto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');

    if (this.roles.some((r) => r.id === id)) {
      throw new BadRequestException(`A role with identifier '${id}' already exists.`);
    }

    const newRole: AdminRole = {
      id,
      title: dto.title,
      description: dto.description || 'Custom administrative role.',
      badgeColor: dto.badgeColor || 'bg-slate-100 text-slate-900 border-slate-300',
      isCustom: true,
      permissions: dto.permissions || {},
    };

    this.roles.push(newRole);
    this.logger.log(`Created custom role: ${newRole.id} (${newRole.title})`);
    return newRole;
  }

  /**
   * Update an existing role (custom or adjust standard permissions)
   */
  updateRole(id: string, dto: Partial<CreateRoleDto>): AdminRole {
    const role = this.getRoleById(id);

    if (dto.title) role.title = dto.title;
    if (dto.description) role.description = dto.description;
    if (dto.badgeColor) role.badgeColor = dto.badgeColor;
    if (dto.permissions) {
      role.permissions = {
        ...role.permissions,
        ...dto.permissions,
      };
    }

    // Update roleTitle on all team members using this role
    this.teamMembers.forEach((m) => {
      if (m.roleId === id) {
        m.roleTitle = role.title;
      }
    });

    this.logger.log(`Updated role: ${id}`);
    return role;
  }

  /**
   * Delete a custom role
   */
  deleteCustomRole(id: string): { success: boolean; message: string } {
    const role = this.getRoleById(id);
    if (!role.isCustom) {
      throw new BadRequestException(`Cannot delete built-in system role '${role.title}'.`);
    }

    // Reassign team members to customer_service
    this.teamMembers.forEach((m) => {
      if (m.roleId === id) {
        m.roleId = 'customer_service';
        m.roleTitle = 'Customer Service Lead';
      }
    });

    this.roles = this.roles.filter((r) => r.id !== id);
    this.logger.log(`Deleted custom role: ${id}`);
    return { success: true, message: `Custom role '${role.title}' deleted successfully.` };
  }

  /**
   * Get all team members
   */
  getTeamMembers(): AdminTeamMember[] {
    return this.teamMembers;
  }

  /**
   * Invite team member
   */
  inviteTeamMember(dto: InviteTeamMemberDto): AdminTeamMember {
    const role = this.getRoleById(dto.roleId);
    const newMember: AdminTeamMember = {
      id: `ADM-00${this.teamMembers.length + 1}`,
      name: dto.name,
      email: dto.email,
      roleId: role.id,
      roleTitle: role.title,
      status: 'INVITED',
      twoFactorEnforced: true,
      lastActive: 'Invited just now',
    };

    this.teamMembers.push(newMember);
    this.logger.log(`Invited team member ${newMember.email} as ${newMember.roleTitle}`);
    return newMember;
  }

  /**
   * Reassign a team member's role
   */
  updateMemberRole(memberId: string, roleId: string): AdminTeamMember {
    const member = this.teamMembers.find((m) => m.id === memberId);
    if (!member) {
      throw new NotFoundException(`Team member '${memberId}' not found.`);
    }

    const role = this.getRoleById(roleId);
    member.roleId = role.id;
    member.roleTitle = role.title;

    this.logger.log(`Reassigned ${member.name} to ${role.title}`);
    return member;
  }
}
