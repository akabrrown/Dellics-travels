import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EsimService } from './esim.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EsimService', () => {
  let service: EsimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EsimService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<EsimService>(EsimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
