import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudyApplicationStage, StudyApplicationStatus, StudyDocumentStatus, StudyTestStatus } from '@prisma/client';

@Injectable()
export class StudyService {
  private readonly logger = new Logger(StudyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllApplications(search?: string, stage?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { applicant_name: { contains: search, mode: 'insensitive' } },
        { applicant_email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (stage && stage !== 'all') {
      where.stage = stage;
    }

    const applications = await this.prisma.studyApplication.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: {
        documents: true,
        tests: true,
        notes: { orderBy: { created_at: 'desc' } },
      },
    });

    return {
      status: 'success',
      data: applications,
    };
  }

  async updateApplication(id: string, data: any) {
    const existing = await this.prisma.studyApplication.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Study application not found');

    const updated = await this.prisma.studyApplication.update({
      where: { id },
      data,
      include: { documents: true, tests: true, notes: { orderBy: { created_at: 'desc' } } },
    });
    return { status: 'success', data: updated };
  }

  async createDocument(applicationId: string, data: { name: string; file_url: string }) {
    const doc = await this.prisma.studyDocument.create({
      data: {
        study_application_id: applicationId,
        name: data.name,
        file_url: data.file_url,
      },
    });
    return { status: 'success', data: doc };
  }

  async updateDocumentStatus(id: string, docId: string, status: StudyDocumentStatus) {
    const doc = await this.prisma.studyDocument.update({
      where: { id: docId },
      data: { status },
    });
    return { status: 'success', data: doc };
  }

  async updateTestStatus(id: string, testId: string, data: { status?: StudyTestStatus; score?: string }) {
    const test = await this.prisma.studyTest.update({
      where: { id: testId },
      data,
    });
    return { status: 'success', data: test };
  }

  async addNote(applicationId: string, data: { author_name: string; text: string }) {
    const note = await this.prisma.studyNote.create({
      data: {
        study_application_id: applicationId,
        author_name: data.author_name,
        text: data.text,
      },
    });
    return { status: 'success', data: note };
  }

  async getMetrics() {
    const total = await this.prisma.studyApplication.count();
    const active = await this.prisma.studyApplication.count({ where: { status: 'IN_PROGRESS' } });
    const testsPending = await this.prisma.studyTest.count({ where: { status: { not: 'COMPLETED' } } });
    const submissions = await this.prisma.studyApplication.count({ where: { stage: 'UNIVERSITY_SUBMISSION' } });
    const visa = await this.prisma.studyApplication.count({ where: { stage: 'VISA_APPLICATION' } });
    
    return {
      total,
      active,
      testsPending,
      submissions,
      visa,
      appointments: 7 // static for now
    };
  }
}
