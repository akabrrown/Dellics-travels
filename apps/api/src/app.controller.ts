import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

  @Get('health/suppliers')
  async getSuppliersHealth() {
    return this.appService.getSuppliersHealth();
  }
}
