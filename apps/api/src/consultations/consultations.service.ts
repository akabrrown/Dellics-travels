import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';
import { ConsultationStatus } from '@prisma/client';


@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateReference(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `DEC-GH-${randomDigits}`;
  }

  async create(dto: CreateConsultationDto) {
    let reference = this.generateReference();

    // Ensure uniqueness
    let exists = await this.prisma.consultationRequest.findUnique({
      where: { reference },
    });
    let attempts = 0;
    while (exists && attempts < 5) {
      reference = this.generateReference();
      exists = await this.prisma.consultationRequest.findUnique({
        where: { reference },
      });
      attempts++;
    }

    const created = await this.prisma.consultationRequest.create({
      data: {
        reference,
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        current_education: dto.currentEducation || null,
        desired_degree: dto.desiredDegree || null,
        desired_program: dto.desiredProgram,
        preferred_destination: dto.preferredDestination,
        target_intake: dto.targetIntake || null,
        test_status: dto.testStatus || null,
        budget_range: dto.budgetRange || null,
        consultation_mode: dto.consultationMode,
        preferred_date: dto.preferredDate || null,
        notes: dto.notes || null,
        status: ConsultationStatus.PENDING,
      },
    });

    this.logger.log(`Created consultation request reference=${reference} email=${dto.email}`);

    return {
      success: true,
      reference: created.reference,
      data: created,
    };
  }

  async findAll(status?: string, consultantEmail?: string) {
    const where: any = {};
    if (status && status !== 'all' && status !== 'ALL') {
      const normalized = status.toUpperCase().replace(/\s+/g, '_') as ConsultationStatus;
      if (Object.values(ConsultationStatus).includes(normalized)) {
        where.status = normalized;
      }
    }

    if (consultantEmail) {
      where.OR = [
        { consultant: { email: { equals: consultantEmail, mode: 'insensitive' } } },
        { assigned_consultant: { path: ['email'], equals: consultantEmail } },
      ];
    }

    const records = await this.prisma.consultationRequest.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: { consultant: true },
    });


    return {
      status: 'success',
      data: records,
    };
  }

  async findOne(id: string) {
    const record = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException(`Consultation request with id ${id} not found`);
    }
    return {
      status: 'success',
      data: record,
    };
  }

  async update(id: string, dto: UpdateConsultationDto) {
    const existing = await this.prisma.consultationRequest.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Consultation request with id ${id} not found`);
    }

    const data: any = {};
    if (dto.status) {
      data.status = dto.status as ConsultationStatus;
    }
    if (dto.assignedConsultant !== undefined) {
      data.assigned_consultant = dto.assignedConsultant;
    }
    if (dto.consultantId !== undefined) {
      data.consultant_id = dto.consultantId || null;
    }
    if (dto.internalNotes !== undefined) {
      data.internal_notes = dto.internalNotes;
    }

    const updated = await this.prisma.consultationRequest.update({
      where: { id },
      data,
      include: { consultant: true },
    });

    return {
      status: 'success',
      data: updated,
    };
  }

  // --- CONSULTANTS CRUD (Admin Only, No hard delete) ---

  async findAllConsultants(activeOnly = false) {
    const where: any = {};
    if (activeOnly) {
      where.is_active = true;
    }
    const consultants = await this.prisma.consultant.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { consultation_requests: true },
        },
      },
    });

    return {
      status: 'success',
      data: consultants,
    };
  }

  async findOneConsultant(id: string) {
    const consultant = await this.prisma.consultant.findUnique({
      where: { id },
    });
    if (!consultant) {
      throw new NotFoundException(`Consultant with id ${id} not found`);
    }
    return {
      status: 'success',
      data: consultant,
    };
  }

  async createConsultant(dto: CreateConsultantDto) {
    const existing = await this.prisma.consultant.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(`Consultant with email ${dto.email} already exists`);
    }

    const created = await this.prisma.consultant.create({
      data: {
        full_name: dto.fullName.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone.trim(),
        specialty: dto.specialty?.trim() || null,
        photo_url: dto.photoUrl?.trim() || null,
        is_active: dto.isActive !== undefined ? dto.isActive : true,
      },
    });

    this.logger.log(`Created consultant id=${created.id} name=${created.full_name}`);
    return {
      status: 'success',
      data: created,
    };
  }

  async updateConsultant(id: string, dto: UpdateConsultantDto) {
    const existing = await this.prisma.consultant.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Consultant with id ${id} not found`);
    }

    const data: any = {};
    if (dto.fullName !== undefined) data.full_name = dto.fullName.trim();
    if (dto.email !== undefined) {
      const emailLower = dto.email.trim().toLowerCase();
      if (emailLower !== existing.email) {
        const dup = await this.prisma.consultant.findUnique({ where: { email: emailLower } });
        if (dup) throw new ConflictException(`Consultant with email ${dto.email} already exists`);
      }
      data.email = emailLower;
    }
    if (dto.phone !== undefined) data.phone = dto.phone.trim();
    if (dto.specialty !== undefined) data.specialty = dto.specialty?.trim() || null;
    if (dto.photoUrl !== undefined) data.photo_url = dto.photoUrl?.trim() || null;
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    const updated = await this.prisma.consultant.update({
      where: { id },
      data,
    });

    this.logger.log(`Updated consultant id=${id} isActive=${updated.is_active}`);
    return {
      status: 'success',
      data: updated,
    };
  }
}


