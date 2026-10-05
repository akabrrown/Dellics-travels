import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as https from 'https';
import * as zlib from 'zlib';
import fetch from 'node-fetch';
import { ZstdTransform } from './ZstdTransform';
import * as readline from 'readline';

const BATCH_SIZE = 500;
const REQUEST_TIMEOUT_MS = 120_000;

type CacheRow = Prisma.HotelStaticCacheCreateInput;

@Injectable()
export class HotelDumpService {
  private readonly logger = new Logger(HotelDumpService.name);
  private syncInProgress = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  

  async syncDump(type: 'full' | 'incremental'): Promise<{ upserted: number; errors: number }> {
    if (this.syncInProgress) {
      this.logger.warn('Dump sync already in progress — skipping');
      return { upserted: 0, errors: 0 };
    }
    this.syncInProgress = true;

    const endpoint =
      type === 'full'
        ? '/hotel/info/dump/'
        : '/hotel/info/incremental_dump/';

    this.logger.log(`Starting ${type} dump from ${endpoint}`);

    let upserted = 0;
    let errors = 0;

    try {
      const stream = await this.fetchDumpStream(endpoint);
      const batch: CacheRow[] = [];

      await new Promise<void>((resolve, reject) => {
        const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

        rl.on('line', (line) => {
          if (!line.trim()) return;
          try {
            const record = JSON.parse(line);
            const row = this.mapDumpRecord(record);
            if (row) batch.push(row);
          } catch {
            errors++;
          }

          if (batch.length >= BATCH_SIZE) {
            const chunk = batch.splice(0, BATCH_SIZE);
            this.flushBatch(chunk)
              .then((n) => { upserted += n; })
              .catch((e: any) => {
                this.logger.error('Batch flush error: ' + e.message);
                errors += chunk.length;
              });
          }
        });

        rl.on('close', async () => {
          if (batch.length > 0) {
            try {
              upserted += await this.flushBatch(batch);
            } catch (e: any) {
              this.logger.error('Final batch flush error: ' + e.message);
              errors += batch.length;
            }
          }
          resolve();
        });

        rl.on('error', reject);
      });

      this.logger.log(`${type} dump complete — upserted: ${upserted}, parse errors: ${errors}`);
      return { upserted, errors };
    } catch (err: any) {
      this.logger.error(`${type} dump failed: ${err.message}`);
      throw err;
    } finally {
      this.syncInProgress = false;
    }
  }

    private async flushBatch(rows: CacheRow[]): Promise<number> {
    for (const row of rows) {
      await this.prisma.hotelStaticCache.upsert({
        where: { id: row.id as string },
        update: { ...row, synced_at: new Date() } as Prisma.HotelStaticCacheUpdateInput,
        create: { ...row, synced_at: new Date() } as Prisma.HotelStaticCacheCreateInput,
      });
    }
    return rows.length;
  }

  private mapDumpRecord(record: any): CacheRow | null {
    const id = record.id;
    if (!id || typeof id !== 'string') return null;

    const images: string[] = [];
    if (Array.isArray(record.images)) {
      for (const img of record.images) {
        const url = typeof img === 'string' ? img : img?.url || '';
        if (url) images.push(this.sanitizeImageUrl(url));
      }
    }
    if (Array.isArray(record.images_ext)) {
      for (const img of record.images_ext) {
        const url = typeof img === 'string' ? img : img?.url || '';
        if (url && !images.includes(url)) images.push(this.sanitizeImageUrl(url));
      }
    }

    const amenities: string[] = [];
    if (Array.isArray(record.amenity_groups)) {
      for (const group of record.amenity_groups) {
        if (Array.isArray(group?.amenities)) {
          for (const item of group.amenities) {
            if (typeof item === 'string' && item.trim() && !amenities.includes(item)) {
              amenities.push(item);
            }
            if (amenities.length >= 8) break;
          }
        }
        if (amenities.length >= 8) break;
      }
    }

    return {
      id,
      name: String(record.name || record.title || id),
      star_rating: Number(record.star_rating || 0),
      address: record.address ? String(record.address) : null,
      city: record.region?.name ? String(record.region.name) : null,
      country_code: record.region?.country_code ? String(record.region.country_code) : null,
      latitude: record.latitude ? Number(record.latitude) : null,
      longitude: record.longitude ? Number(record.longitude) : null,
      images: images,
      amenities: amenities,
      description: record.description_struct?.[0]?.paragraphs?.[0] ?? record.description ?? null,
    };
  }

  private sanitizeImageUrl(url: string): string {
    return url.replace('{size}', '1024x768').replace('%7Bsize%7D', '1024x768');
  }

    private async fetchDumpStream(endpoint: string): Promise<NodeJS.ReadableStream> {
    const rawBase = this.config.get<string>('RATEHAWK_BASE_URL') || 'https://api.ratehawk.com/api/b2b/v3';
    const cleanBase = rawBase.replace(/\/api\/b2b\/v3.*$/, '');
    const fullUrl = cleanBase + '/api/b2b/v3' + endpoint;

    const apiId = this.config.get<string>('RATEHAWK_KEY_ID') || this.config.get<string>('RATEHAWK_API_ID') || '494';
    const apiKey = this.config.get<string>('RATEHAWK_API_KEY') || '';
    const auth = Buffer.from(apiId + ':' + apiKey).toString('base64');

    const body = JSON.stringify({ language: 'en' });

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json',
      },
      body
    });

    if (!res.ok) {
      throw new Error('Dump endpoint HTTP ' + res.status);
    }

    const json = await res.json() as any;
    const dumpUrl = json?.data?.url;
    
    if (!dumpUrl) {
      throw new Error('No dump URL in response: ' + JSON.stringify(json));
    }

    const dumpRes = await fetch(dumpUrl);
    if (!dumpRes.ok) {
      throw new Error('Dump download HTTP ' + dumpRes.status);
    }

    if (dumpUrl.endsWith('.gz')) {
        return (dumpRes.body as any).pipe(zlib.createGunzip());
    }

    return (dumpRes.body as any).pipe(new ZstdTransform());
  }
}
