const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  const password = "Admin@123!";
  const hash = await bcrypt.hash(password, 10);
  
  const emails = [
    'help@dellicstravels.com',
    'dellicstravelsitteam@gmail.com',
    'akayetb@gmail.com',
    'ops@dellicstravels.com'
  ];

  for (const email of emails) {
    await prisma.user.upsert({
      where: { email },
      update: {
        role: 'ADMIN',
        admin_role_id: 'master_admin',
        password_hash: hash
      },
      create: {
        name: 'Admin',
        email,
        role: 'ADMIN',
        admin_role_id: 'master_admin',
        password_hash: hash
      }
    });
    console.log(`Updated admin: ${email}`);
  }
}
run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
