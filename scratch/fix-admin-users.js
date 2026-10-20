const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: 'ADMIN', admin_role_id: null },
    data: { admin_role_id: 'master_admin' }
  });
  console.log("Updated admin users:", result);
}
main().catch(console.error).finally(() => prisma.$disconnect());
