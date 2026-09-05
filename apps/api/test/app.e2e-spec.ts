import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const mockPrisma = {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Dellics Travels API Live Gateway');
  });

  it('/health/cache (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/cache')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('dellics-api-cache');
    expect(res.body.metrics).toBeDefined();
    expect(res.body.metrics.maxCapacity).toBe(1000);
  });

  afterEach(async () => {
    await app.close();
  });
});
