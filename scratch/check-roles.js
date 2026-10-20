const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminRoles = await prisma.adminRole.findMany();
  console.log("Admin Roles in DB:", JSON.stringify(adminRoles, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
