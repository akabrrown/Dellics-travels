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
    let dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl && !dbUrl.includes('connect_timeout')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'connect_timeout=30';
    }

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
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.$connect();
        console.log('[PrismaService] Connected to Supabase PostgreSQL successfully.');
        return;
      } catch (err) {
        if (attempt === 3) {
          console.warn(
            '[PrismaService] Deferred database connection warning after 3 attempts:',
            err instanceof Error ? err.message : err,
          );
        } else {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
