const fs = require('fs');

const carTypes = `export interface CarSearchCriteria {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string; // ISO String
  dropoffDateTime: string; // ISO String
  currency?: string;
}

export interface CarResult {
  id: string;
  provider: string;
  vendorName: string;
  vehicle: {
    name: string;
    category: string;
    transmission: string;
    seats: number;
    doors: number;
    airConditioning: boolean;
    image: string;
  };
  price: number;
  currency: string;
  pickupLocation: string;
  dropoffLocation: string;
}
`;

const carProviderInterface = `import { CarSearchCriteria, CarResult } from './car.types';

export interface ICarProvider {
  readonly name: string;
  search(criteria: CarSearchCriteria): Promise<CarResult[]>;
}
`;

const cartrawlerProvider = `import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICarProvider } from '../interfaces/car-provider.interface';
import { CarSearchCriteria, CarResult } from '../interfaces/car.types';

@Injectable()
export class CartrawlerProvider implements ICarProvider {
  public readonly name = 'cartrawler';
  private readonly logger = new Logger(CartrawlerProvider.name);

  constructor(private configService: ConfigService) {}

  async search(criteria: CarSearchCriteria): Promise<CarResult[]> {
    this.logger.log(\`Searching Cartrawler for cars at \${criteria.pickupLocation}\`);
    // Mock implementation for Phase 1
    return [
      {
        id: \`ct-\${Date.now()}\`,
        provider: this.name,
        vendorName: 'Hertz',
        vehicle: {
          name: 'Toyota Corolla or similar',
          category: 'Compact',
          transmission: 'Automatic',
          seats: 5,
          doors: 4,
          airConditioning: true,
          image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
        },
        price: 150,
        currency: criteria.currency || 'USD',
        pickupLocation: criteria.pickupLocation,
        dropoffLocation: criteria.dropoffLocation,
      }
    ];
  }
}
`;

const carsService = `import { Injectable, Logger } from '@nestjs/common';
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
    this.logger.log(\`Searching cars from \${criteria.pickupLocation}\`);
    
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
`;

const carsController = `import { Body, Controller, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarSearchCriteria } from '../providers/cars/interfaces/car.types';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('search')
  search(@Body() criteria: CarSearchCriteria) {
    return this.carsService.search(criteria);
  }
}
`;

const carsModule = `import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CartrawlerProvider } from '../providers/cars/cartrawler/cartrawler.provider';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService, CartrawlerProvider],
  exports: [CarsService],
})
export class CarsModule {}
`;

fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/providers/cars/interfaces/car.types.ts', carTypes);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/providers/cars/interfaces/car-provider.interface.ts', carProviderInterface);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/providers/cars/cartrawler/cartrawler.provider.ts', cartrawlerProvider);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/cars/cars.service.ts', carsService);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/cars/cars.controller.ts', carsController);
fs.writeFileSync('C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/cars/cars.module.ts', carsModule);

let appModulePath = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/app.module.ts';
let appModuleContent = fs.readFileSync(appModulePath, 'utf8');
if (!appModuleContent.includes('CarsModule')) {
  appModuleContent = appModuleContent.replace(
    "import { WebhooksModule } from './webhooks/webhooks.module';",
    "import { WebhooksModule } from './webhooks/webhooks.module';\nimport { CarsModule } from './cars/cars.module';"
  );
  appModuleContent = appModuleContent.replace(
    "WebhooksModule,",
    "WebhooksModule,\n    CarsModule,"
  );
  fs.writeFileSync(appModulePath, appModuleContent);
}

console.log('Successfully setup cars module');
