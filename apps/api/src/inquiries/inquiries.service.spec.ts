import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiriesService } from './inquiries.service';

describe('InquiriesService', () => {
  const create = jest.fn().mockResolvedValue({ id: 'inq-1' });
  const prisma = { inquiry: { create } } as unknown as PrismaService;

  function buildService(): InquiriesService {
    return new InquiriesService(
      prisma,
      new ConfigService({ RESEND_API_KEY: '', INQUIRY_NOTIFY_EMAIL: '' }),
    );
  }

  beforeEach(() => create.mockClear());

  it('persists a contact submission and returns an opaque id', async () => {
    const service = buildService();
    const res = await service.create({
      kind: 'CONTACT',
      name: 'Ama Serwaa',
      email: 'ama@example.com',
      message: 'Hello, I have a question.',
    } as any);
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: 'CONTACT',
        name: 'Ama Serwaa',
        email: 'ama@example.com',
      }),
    });
    expect(res).toEqual({ received: true });
  });

  it('rejects non-email email values', async () => {
    const service = buildService();
    await expect(
      service.create({
        kind: 'CONTACT',
        name: 'Ama',
        email: 'not-an-email',
        message: 'Hi',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('stores inquiry extras inside payload', async () => {
    const service = buildService();
    await service.create({
      kind: 'INQUIRY',
      name: 'Kofi Mensah',
      email: 'kofi@example.com',
      message: 'Zanzibar package for 4.',
      destination: 'Zanzibar',
      travelDate: '2026-12-01',
      travelers: '4 Passengers',
    } as any);
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: 'INQUIRY',
        payload: {
          destination: 'Zanzibar',
          travelDate: '2026-12-01',
          travelers: '4 Passengers',
        },
      }),
    });
  });
});
