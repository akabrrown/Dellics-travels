import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@dellics/database';
import * as dotenv from 'dotenv';

dotenv.config({ override: true });

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbUrl =
      process.env.DATABASE_URL ||
      'postgresql://postgres.gfypumkjomlvvpiiwdfq:X2tCgmfP5yGSP0d0@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log:
        process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      console.warn(
        '[PrismaService] Deferred database connection warning during onModuleInit:',
        err instanceof Error ? err.message : err,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
