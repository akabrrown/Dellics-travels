if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.DIRECT_URL ||
    "postgresql://postgres.gfypumkjomlvvpiiwdfq:X2tCgmfP5yGSP0d0@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    "postgresql://postgres.gfypumkjomlvvpiiwdfq:X2tCgmfP5yGSP0d0@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
}

export { prisma } from "@dellics/database";
export * from "@dellics/database";
