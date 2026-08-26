import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

async function syncUsers() {
  console.log('Fetching users from auth.users...');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error fetching auth users:', error);
    return;
  }

  console.log(`Found ${users.length} users. Syncing to Prisma User table...`);

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { id: user.id } });
    if (!existing) {
      const name = (user.user_metadata?.first_name || 'Traveler') + ' ' + (user.user_metadata?.last_name || '');
      await prisma.user.create({
        data: {
          id: user.id,
          name: name.trim(),
          email: user.email!,
          phone: user.user_metadata?.phone || null,
          role: 'USER',
          membership_tier: 'EXPLORER'
        }
      });
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  console.log('Sync complete!');
}

syncUsers().catch(console.error).finally(() => prisma.$disconnect());
