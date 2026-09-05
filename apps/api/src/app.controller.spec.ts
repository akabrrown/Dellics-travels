import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache/cache.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockAppService = {
      getHello: jest.fn().mockReturnValue('Dellics Travels API Live Gateway'),
      getSuppliersHealth: jest.fn().mockResolvedValue({
        status: 'HEALTHY',
        timestamp: new Date().toISOString(),
        services: [],
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        CacheService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return live gateway message', () => {
      expect(appController.getHello()).toBe('Dellics Travels API Live Gateway');
    });

    it('should return health status ok', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('ok');
      expect(health.service).toBe('dellics-api');
      expect(health.timestamp).toBeDefined();
    });

    it('should return cache health metrics', () => {
      const cacheHealth = appController.getCacheHealth();
      expect(cacheHealth.status).toBe('ok');
      expect(cacheHealth.service).toBe('dellics-api-cache');
      expect(cacheHealth.metrics).toBeDefined();
      expect(cacheHealth.metrics.maxCapacity).toBeGreaterThan(0);
    });
  });
});
