import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const defaultDbUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres.gfypumkjomlvvpiiwdfq:X2tCgmfP5yGSP0d0@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const defaultDirectUrl =
  process.env.DIRECT_URL ||
  "postgresql://postgres.gfypumkjomlvvpiiwdfq:X2tCgmfP5yGSP0d0@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = defaultDbUrl;
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = defaultDirectUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: defaultDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '@prisma/client';
