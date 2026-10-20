const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PERMISSION_CATALOG = [
  { key: 'dashboard.view' }, { key: 'bookings.view' }, { key: 'bookings.manage' },
  { key: 'travelers.view' }, { key: 'travelers.manage' }, { key: 'content.view' },
  { key: 'content.create' }, { key: 'content.publish' }, { key: 'content.delete' },
  { key: 'promotions.manage' }, { key: 'esims.view' }, { key: 'esims.manage' },
  { key: 'support.view' }, { key: 'support.reply' }, { key: 'reviews.manage' },
  { key: 'finance.view' }, { key: 'finance.export' }, { key: 'refunds.view' },
  { key: 'refunds.approve' }, { key: 'health.view' }, { key: 'analytics.view' },
  { key: 'membership.manage' }, { key: 'team.view' }, { key: 'team.manage_roles' },
  { key: 'team.custom_roles' }, { key: 'audit.view' }, { key: 'settings.manage' }
];

const INITIAL_ROLES = [
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
      'dashboard.view': true, 'bookings.view': true, 'bookings.manage': true,
      'travelers.view': true, 'travelers.manage': true, 'content.view': true,
      'content.create': true, 'content.publish': true, 'content.delete': false,
      'promotions.manage': true, 'esims.view': true, 'esims.manage': true,
      'support.view': true, 'support.reply': true, 'reviews.manage': true,
      'finance.view': false, 'finance.export': false, 'refunds.view': true,
      'refunds.approve': false, 'health.view': true, 'analytics.view': true,
      'membership.manage': true, 'team.view': true, 'team.manage_roles': false,
      'team.custom_roles': false, 'audit.view': false, 'settings.manage': false,
    },
  },
  {
    id: 'customer_service',
    title: 'Customer Service Lead',
    description: 'Client front desk: manages support inquiries, traveler bookings assistance, review responses, and eSIM delivery.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    isCustom: false,
    permissions: {
      'dashboard.view': true, 'bookings.view': true, 'bookings.manage': false,
      'travelers.view': true, 'travelers.manage': false, 'content.view': false,
      'content.create': false, 'content.publish': false, 'content.delete': false,
      'promotions.manage': false, 'esims.view': true, 'esims.manage': false,
      'support.view': true, 'support.reply': true, 'reviews.manage': true,
      'finance.view': false, 'finance.export': false, 'refunds.view': true,
      'refunds.approve': false, 'health.view': false, 'analytics.view': false,
      'membership.manage': false, 'team.view': false, 'team.manage_roles': false,
      'team.custom_roles': false, 'audit.view': false, 'settings.manage': false,
    },
  },
  {
    id: 'finance_team',
    title: 'Finance & Reconciliation',
    description: 'Accounting specialist: manages Paystack reconciliations, payment settlements, refunds queue, and revenue reports.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    isCustom: false,
    permissions: {
      'dashboard.view': true, 'bookings.view': true, 'bookings.manage': false,
      'travelers.view': false, 'travelers.manage': false, 'content.view': false,
      'content.create': false, 'content.publish': false, 'content.delete': false,
      'promotions.manage': false, 'esims.view': false, 'esims.manage': false,
      'support.view': false, 'support.reply': false, 'reviews.manage': false,
      'finance.view': true, 'finance.export': true, 'refunds.view': true,
      'refunds.approve': true, 'health.view': false, 'analytics.view': true,
      'membership.manage': false, 'team.view': false, 'team.manage_roles': false,
      'team.custom_roles': false, 'audit.view': false, 'settings.manage': false,
    },
  }
];

async function main() {
  for (const role of INITIAL_ROLES) {
    await prisma.adminRole.upsert({
      where: { id: role.id },
      update: {},
      create: role
    });
  }
  console.log("Seeded standard admin roles.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
