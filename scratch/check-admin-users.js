const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true, role: true, admin_role_id: true }
  });
  console.log("Admin users in DB:", users);
  
  const allUsers = await prisma.user.findMany({
    take: 5,
    select: { email: true, role: true, admin_role_id: true }
  });
  console.log("Sample of all users:", allUsers);
}
main().catch(console.error).finally(() => prisma.$disconnect());
