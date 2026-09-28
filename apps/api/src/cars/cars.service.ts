import { Injectable, Logger } from '@nestjs/common';
import { CartrawlerProvider } from '../providers/cars/cartrawler/cartrawler.provider';
import { CarSearchCriteria, CarResult } from '../providers/cars/interfaces/car.types';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CarsService {
  private readonly logger = new Logger(CarsService.name);
  private readonly providers: any[];

  constructor(
    private cartrawlerProvider: CartrawlerProvider,
    private prisma: PrismaService,
    private cache: CacheService,
  ) {
    this.providers = [this.cartrawlerProvider];
  }

  async search(criteria: CarSearchCriteria): Promise<CarResult[]> {
    this.logger.log(`Searching cars from ${criteria.pickupLocation}`);
    
    const providerPromises = this.providers.map(p => p.search(criteria).catch(() => []));
    const results = await Promise.all(providerPromises);
    const allCars = results.flat();

    const markup = await this.getMarkupPercentage();
    return allCars.map(car => ({
      ...car,
      price: Math.ceil(car.price * (1 + markup))
    })).sort((a, b) => a.price - b.price);
  }

  private async getMarkupPercentage(): Promise<number> {
    const cacheKey = 'markup:cars:global';
    const cached = this.cache.get<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const rule = await this.prisma.markupRule.findFirst({
        where: { isActive: true },
        orderBy: { created_at: 'desc' }
      });
      const markup = rule ? Number(rule.value) / 100 : 0.15;
      this.cache.set(cacheKey, markup, 300000);
      return markup;
    } catch {
      return 0.15;
    }
  }
}
