import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ToursService', () => {
  let service: ToursService;

  const mockPrismaService = {
    tourPackage: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mock-id', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      delete: jest.fn().mockResolvedValue({ id: 'mock-id' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return catalog tours when database is empty', async () => {
    const result = await service.getTours();
    expect(result.status).toBe('success');
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toBeDefined();
  });

  it('should create a tour and return formatted result', async () => {
    const created = await service.createTour({
      title: 'Mole National Park Wildlife Safari',
      destination: 'Northern Region, Ghana',
      price: 450,
      duration: '3 Days / 2 Nights',
      overview: 'Elephant safari in Savannah vegetation.',
    });

    expect(created.name).toBe('Mole National Park Wildlife Safari');
    expect(created.destination).toBe('Northern Region, Ghana');
    expect(created.rawPrice).toBe(450);
  });
});
