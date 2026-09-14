import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EsimService } from './esim.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EsimService', () => {
  let service: EsimService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      eSIMOrder: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EsimService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EsimService>(EsimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate amount of Data and Airtime bought across orders in getAdminOrders', async () => {
    mockPrisma.eSIMOrder.findMany.mockResolvedValue([
      {
        id: 'order-1',
        paystack_reference: 'ref-1',
        status: 'ACTIVE',
        iccid: '890012345678',
        qr_code_url: 'https://qr.test/1',
        created_at: new Date('2026-09-01'),
        user: { name: 'Kofi Mensah', email: 'kofi@dellics.com' },
        esim_plan: {
          country_or_region: 'Ghana',
          data_gb: 10.0,
          airtime_minutes: 100,
          validity_days: 30,
          price: 24.0,
        },
      },
      {
        id: 'order-2',
        paystack_reference: 'ref-2',
        status: 'PROVISIONED',
        iccid: '890087654321',
        qr_code_url: 'https://qr.test/2',
        created_at: new Date('2026-09-02'),
        user: { name: 'Ama Osei', email: 'ama@dellics.com' },
        esim_plan: {
          country_or_region: 'United Arab Emirates',
          data_gb: 20.0,
          airtime_minutes: 200,
          validity_days: 30,
          price: 45.0,
        },
      },
      {
        id: 'order-3',
        paystack_reference: 'ref-3',
        status: 'PENDING',
        iccid: null,
        qr_code_url: null,
        created_at: new Date('2026-09-03'),
        user: { name: 'Kwame Darko', email: 'kwame@dellics.com' },
        esim_plan: {
          country_or_region: 'United Kingdom',
          data_gb: 5.0,
          airtime_minutes: 0,
          validity_days: 14,
          price: 18.0,
        },
      },
    ]);

    const result = await service.getAdminOrders();

    expect(result.status).toBe('success');
    expect(result.count).toBe(3);

    // Verify individual order data & airtime values
    expect(result.data[0].dataGb).toBe(10.0);
    expect(result.data[0].airtimeMinutes).toBe(100);
    expect(result.data[0].price).toBe(24.0);

    expect(result.data[1].dataGb).toBe(20.0);
    expect(result.data[1].airtimeMinutes).toBe(200);

    expect(result.data[2].dataGb).toBe(5.0);
    expect(result.data[2].airtimeMinutes).toBe(0);

    // Verify cumulative summary ledger
    expect(result.summary.totalOrders).toBe(3);
    expect(result.summary.totalDataGb).toBe(35.0); // 10 + 20 + 5
    expect(result.summary.totalAirtimeMinutes).toBe(300); // 100 + 200 + 0
    expect(result.summary.totalRevenueUsd).toBe(87.0); // 24 + 45 + 18
    expect(result.summary.activeOrders).toBe(2);
    expect(result.summary.pendingOrders).toBe(1);
  });
});
