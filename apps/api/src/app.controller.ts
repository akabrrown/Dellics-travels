import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache/cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'dellics-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/cache')
  getCacheHealth() {
    const metrics = this.cacheService.getMetrics();
    return {
      status: 'ok',
      service: 'dellics-api-cache',
      timestamp: new Date().toISOString(),
      metrics,
    };
  }

  @Get('health/suppliers')
  async getSuppliersHealth() {
    return this.appService.getSuppliersHealth();
  }
}
