import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ZohoService } from '../zoho/zoho.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly zohoService: ZohoService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<{ received: true }> {
    if (!EMAIL_RE.test(dto.email)) {
      throw new BadRequestException('Please provide a valid email address.');
    }
    const payload =
      dto.kind === 'INQUIRY'
        ? {
            destination: dto.destination,
            travelDate: dto.travelDate,
            travelers: dto.travelers,
          }
        : undefined;

    const record = await this.prisma.inquiry.create({
      data: {
        kind: dto.kind,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        payload,
      },
    });

    // Notify via email and sync to Zoho CRM in parallel
    await Promise.allSettled([
      this.notify(record.id, dto),
      this.syncToZoho(record.id, dto, payload),
    ]);

    return { received: true }; // opaque ack — never echo stored data back
  }

  private async syncToZoho(
    id: string,
    dto: CreateInquiryDto,
    payload?: Record<string, any>,
  ): Promise<void> {
    try {
      let description = `Type: ${dto.kind}\nSubmission ID: ${id}\nMessage: ${dto.message}`;
      if (payload) {
        if (payload.destination) description += `\nDestination: ${payload.destination}`;
        if (payload.travelDate) description += `\nTravel Date: ${payload.travelDate}`;
        if (payload.travelers) description += `\nTravelers: ${payload.travelers}`;
      }

      await this.zohoService.createLead({
        firstName: dto.name,
        email: dto.email,
        phone: dto.phone,
        leadSource: `Dellics Website (${dto.kind})`,
        description,
      });
    } catch (error) {
      this.logger.warn(
        `Inquiry ${id} persisted but Zoho CRM sync failed: ${(error as Error).message}`,
      );
    }
  }

  private async notify(id: string, dto: CreateInquiryDto): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const to = this.config.get<string>('INQUIRY_NOTIFY_EMAIL');
    if (!apiKey || !to) return; // degrade gracefully: record is already persisted
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Dellics Travels Website <website@dellicstravels.com>',
          to: [to],
          subject: `New ${dto.kind.toLowerCase()} submission (${id})`,
          text: `${dto.name} <${dto.email}>${dto.phone ? ` · ${dto.phone}` : ''}\n\n${dto.message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } catch (error) {
      this.logger.warn(
        `Inquiry ${id} persisted but email notify failed: ${(error as Error).message}`,
      );
    }
  }

  async findAll(kind?: string) {
    const where: any = {};
    if (kind) {
      where.kind = kind.toUpperCase();
    }
    const items = await this.prisma.inquiry.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 100,
    });
    return { status: 'success', count: items.length, data: items };
  }

  async getStats() {
    const [total, inquiries, contacts] = await Promise.all([
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { kind: 'INQUIRY' } }),
      this.prisma.inquiry.count({ where: { kind: 'CONTACT' } }),
    ]);
    return {
      status: 'success',
      data: { total, inquiries, contacts },
    };
  }
}
