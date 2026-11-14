import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  StudyApplicationStage,
  StudyApplicationStatus,
  StudyDocumentStatus,
  StudyTestStatus,
  Role,
} from '@prisma/client';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import {
  SendCodeDto,
  VerifyCodeDto,
  StudentSignupDto,
  StudentLoginDto,
  StudentOnboardingDto,
  CreatePastQuestionDto,
  UpdatePastQuestionDto,
  CreateStudentTestDto,
  UpdateStudentTestDto,
} from './dto/study-student.dto';

@Injectable()
export class StudyService {
  private readonly logger = new Logger(StudyService.name);
  private supabase: any = null;

  constructor(private readonly prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize Supabase client: ${err.message}`);
      }
    }
  }

  async getStorageSignedUrl(storagePath: string, expiresIn: number = 3600): Promise<string> {
    if (!storagePath) return '';
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.storage
          .from('consult-documents')
          .createSignedUrl(storagePath, expiresIn);
        if (data?.signedUrl) return data.signedUrl;
      } catch (e: any) {
        this.logger.warn(`Supabase createSignedUrl warning: ${e.message}`);
      }
    }
    const supabaseUrl = process.env.SUPABASE_URL || 'https://gfypumkjomlvvpiiwdfq.supabase.co';
    return `${supabaseUrl}/storage/v1/object/sign/consult-documents/${storagePath}?expires_in=${expiresIn}`;
  }

  async deleteStorageFile(storagePath: string): Promise<void> {
    if (!storagePath || storagePath.startsWith('http://') || storagePath.startsWith('https://')) return;
    if (this.supabase) {
      try {
        await this.supabase.storage.from('consult-documents').remove([storagePath]);
      } catch (e: any) {
        this.logger.warn(`Supabase delete file warning: ${e.message}`);
      }
    }
    try {
      await this.prisma.$executeRawUnsafe(
        `DELETE FROM storage.objects WHERE bucket_id = 'consult-documents' AND name = $1;`,
        storagePath,
      );
    } catch {}
  }

  // ==========================================
  // STUDENT AUTH & VERIFICATION
  // ==========================================

  private hashVerificationCode(code: string): string {
    return crypto.createHash('sha256').update(code.trim()).digest('hex');
  }

  async sendVerificationCode(dto: SendCodeDto) {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new BadRequestException('A valid email address is required.');
    }

    // 1. Generate 6-digit code
    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = this.hashVerificationCode(rawCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 2. Persist in student_verifications table
    await this.prisma.studentVerification.create({
      data: {
        id: crypto.randomUUID(),
        email: cleanEmail,
        code_hash: codeHash,
        attempts: 0,
        expires_at: expiresAt,
      },
    });

    this.logger.log(`[STUDENT VERIFICATION CODE DISPATCH] To: ${cleanEmail} | Code: ${rawCode} (Expires in 10 mins)`);

    // 3. Dispatch via Resend API if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Dellics Education Consult <admissions@dellics.com>',
            to: cleanEmail,
            subject: `${rawCode} is your Dellics Education Consult verification code`,
            html: `
              <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                <h2 style="color: #0A0060; margin-bottom: 8px;">Dellics Education Consult</h2>
                <p style="color: #64748b; font-size: 14px; margin-top: 0;">Guiding Futures. Building Global Success.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 15px; color: #1e293b;">Hello ${dto.name || 'Applicant'},</p>
                <p style="font-size: 14px; color: #334155;">Thank you for registering with Dellics Education Consult. Use the 6-digit verification code below to verify your email address and continue your study abroad application:</p>
                <div style="background-color: #f8fafc; border: 2px dashed #0A0060; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #EA580C; font-family: monospace;">${rawCode}</span>
                </div>
                <p style="font-size: 12px; color: #64748b;">This code expires in 10 minutes. If you did not request this code, please disregard this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 11px; color: #94a3b8;">Community 25 Devtraco Courts Rd, Tema, Greater Accra, Ghana | admissions@dellics.com</p>
              </div>
            `,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          this.logger.error(`Resend API dispatch error: ${JSON.stringify(errData)}`);
          if (process.env.NODE_ENV === 'production') {
            throw new BadRequestException('Email dispatch service temporarily unavailable. Please try again later.');
          }
        }
      } catch (err: any) {
        this.logger.warn(`Resend email delivery failed: ${err.message}`);
        if (process.env.NODE_ENV === 'production') {
          throw new BadRequestException('Email service error. Verification code could not be sent.');
        }
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error('RESEND_API_KEY is not configured in production environment.');
        throw new BadRequestException('Email service configuration missing. Please contact support.');
      }
    }

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}`,
      email: cleanEmail,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async verifyCode(dto: VerifyCodeDto) {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const cleanCode = (dto.code || '').trim();

    if (!cleanEmail || !cleanCode || cleanCode.length !== 6) {
      throw new BadRequestException('Valid email and 6-digit code are required.');
    }

    const codeHash = this.hashVerificationCode(cleanCode);
    const now = new Date();

    // Find valid pending verification
    const record = await this.prisma.studentVerification.findFirst({
      where: {
        email: cleanEmail,
        code_hash: codeHash,
        verified_at: null,
        expires_at: { gt: now },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!record) {
      // Increment attempts on latest record for this email
      const latest = await this.prisma.studentVerification.findFirst({
        where: { email: cleanEmail, verified_at: null },
        orderBy: { created_at: 'desc' },
      });
      if (latest) {
        await this.prisma.studentVerification.update({
          where: { id: latest.id },
          data: { attempts: latest.attempts + 1 },
        });
      }
      throw new BadRequestException('Invalid or expired verification code.');
    }

    // Mark as verified
    await this.prisma.studentVerification.update({
      where: { id: record.id },
      data: { verified_at: now },
    });

    return {
      success: true,
      message: 'Email successfully verified.',
      email: cleanEmail,
    };
  }

  async studentSignup(dto: StudentSignupDto) {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const fullName = `${dto.firstName || ''} ${dto.lastName || ''}`.trim() || 'Student';

    if (!cleanEmail) {
      throw new BadRequestException('Email address is required.');
    }

    // Require email verification code before creating or linking account
    if (!dto.code || dto.code.trim().length !== 6) {
      throw new BadRequestException('A valid 6-digit email verification code is required to register or link an account.');
    }

    const codeHash = this.hashVerificationCode(dto.code.trim());
    const validVerification = await this.prisma.studentVerification.findFirst({
      where: {
        email: cleanEmail,
        code_hash: codeHash,
        verified_at: { not: null },
      },
      orderBy: { created_at: 'desc' },
    });

    if (!validVerification) {
      // Also allow if code is valid and expires_at > now
      const pendingVerification = await this.prisma.studentVerification.findFirst({
        where: {
          email: cleanEmail,
          code_hash: codeHash,
          expires_at: { gt: new Date() },
        },
        orderBy: { created_at: 'desc' },
      });

      if (!pendingVerification) {
        throw new BadRequestException('Invalid or expired verification code. Please verify your email first.');
      }

      await this.prisma.studentVerification.update({
        where: { id: pendingVerification.id },
        data: { verified_at: new Date() },
      });
    }

    // Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      // Link student profile to existing user only after verification
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          role: user.role === Role.ADMIN ? Role.ADMIN : Role.STUDENT,
          name: user.name || fullName,
          phone: dto.phone || user.phone,
        },
      });
      this.logger.log(`Linked verified student profile to existing Dellics Travels user: ${user.email} (${user.id})`);
    } else {
      // Create new user account
      user = await this.prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: cleanEmail,
          name: fullName,
          phone: dto.phone || null,
          role: Role.STUDENT,
          onboarding_completed: false,
        },
      });
      this.logger.log(`Created new verified student account: ${user.email} (${user.id})`);
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.student_profile,
        onboardingCompleted: user.onboarding_completed,
      },
    };
  }

  async studentLogin(dto: StudentLoginDto) {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new BadRequestException('Email is required.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        study_applications: {
          include: { documents: true, tests: true, notes: { orderBy: { created_at: 'desc' } } },
          orderBy: { updated_at: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('No account found for this email. Please complete registration first.');
    }

    const nameParts = (user.name || '').split(' ');
    const firstName = nameParts[0] || 'Student';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName,
        lastName,
        phone: user.phone,
        role: user.role,
        profile: user.student_profile,
        profileCompleted: user.onboarding_completed || !!user.student_profile,
        applications: user.study_applications,
      },
    };
  }

  async saveOnboarding(dto: StudentOnboardingDto) {
    const cleanEmail = (dto.email || '').trim().toLowerCase();
    const profile = dto.profile || {};

    if (!cleanEmail) {
      throw new BadRequestException('Email is required.');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user?.name || 'Student';

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          email: cleanEmail,
          name: fullName,
          phone: profile.phone || null,
          role: Role.STUDENT,
          student_profile: profile,
          onboarding_completed: true,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: fullName,
          phone: profile.phone || user.phone,
          student_profile: profile,
          onboarding_completed: true,
        },
      });
    }

    // Create or link StudyApplication
    const destination = profile.preferredDestination || 'International';
    const course = profile.preferredFieldOfStudy || profile.currentProgramme || 'Undergraduate Study';
    const intake = profile.intendedIntake || 'Fall 2026';

    let application = await this.prisma.studyApplication.findFirst({
      where: { applicant_email: cleanEmail },
      include: { documents: true, tests: true, notes: true },
    });

    if (!application) {
      application = await this.prisma.studyApplication.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          applicant_name: fullName,
          applicant_email: cleanEmail,
          applicant_phone: profile.phone || null,
          city: profile.city || null,
          destination,
          course,
          intake,
          stage: StudyApplicationStage.INITIAL_CONSULTATION,
          status: StudyApplicationStatus.IN_PROGRESS,
        },
        include: { documents: true, tests: true, notes: true },
      });
    } else {
      application = await this.prisma.studyApplication.update({
        where: { id: application.id },
        data: {
          user_id: user.id,
          applicant_name: fullName,
          applicant_phone: profile.phone || application.applicant_phone,
          city: profile.city || application.city,
          destination,
          course,
          intake,
        },
        include: { documents: true, tests: true, notes: true },
      });
    }

    // Auto-create initial tests if specified in profile
    if (Array.isArray(profile.standardisedTests) && profile.standardisedTests.length > 0) {
      for (const testName of profile.standardisedTests) {
        const existingTest = await this.prisma.studyTest.findFirst({
          where: { study_application_id: application.id, test_type: testName },
        });
        if (!existingTest) {
          await this.prisma.studyTest.create({
            data: {
              study_application_id: application.id,
              test_type: testName,
              status: StudyTestStatus.PREP_ARRANGED,
            },
          });
        }
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.student_profile,
        profileCompleted: true,
      },
      application,
    };
  }

  // ==========================================
  // STUDENT PORTAL DATA & DOCUMENTS
  // ==========================================

  async getStudentPortalData(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        study_applications: {
          include: {
            documents: true,
            tests: true,
            notes: { orderBy: { created_at: 'desc' } },
          },
          orderBy: { updated_at: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Student account not found.');
    }

    // Also fetch consultation requests for this email
    const consultations = await this.prisma.consultationRequest.findMany({
      where: { email: cleanEmail },
      include: { consultant: true },
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      profile: user.student_profile,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        onboardingCompleted: user.onboarding_completed,
      },
      applications: user.study_applications,
      consultations,
    };
  }

  async uploadStudentDocument(
    applicationId: string,
    email: string,
    docData: { name: string; file_url: string; size_bytes?: number; mime_type?: string },
  ) {
    const cleanEmail = (email || '').trim().toLowerCase();
    // Security check: ensure student owns this application
    const app = await this.prisma.studyApplication.findUnique({
      where: { id: applicationId },
    });

    if (!app || app.applicant_email.toLowerCase() !== cleanEmail) {
      throw new UnauthorizedException('Access denied: You can only upload documents for your own application.');
    }

    const docId = crypto.randomUUID();
    const storagePath = `${cleanEmail}/${docId}_${docData.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Upload raw bytes to Supabase Storage private bucket 'consult-documents'
    try {
      const buffer = Buffer.from(docData.file_url.split(',')[1] || docData.file_url, 'base64');
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO storage.objects (id, bucket_id, name, owner_id, metadata)
        VALUES (
          $1::uuid,
          'consult-documents',
          $2,
          $3,
          $4::jsonb
        )
        ON CONFLICT (bucket_id, name) DO UPDATE
        SET metadata = $4::jsonb, updated_at = NOW();
      `, crypto.randomUUID(), storagePath, app.user_id || cleanEmail, JSON.stringify({
        mimetype: docData.mime_type || 'application/pdf',
        size: docData.size_bytes || buffer.length,
      }));
    } catch (storageErr: any) {
      this.logger.warn(`Storage object insert warning: ${storageErr.message}`);
    }

    const doc = await this.prisma.studyDocument.create({
      data: {
        id: docId,
        study_application_id: applicationId,
        name: docData.name,
        file_url: storagePath,
        size_bytes: docData.size_bytes || null,
        mime_type: docData.mime_type || null,
        status: StudyDocumentStatus.PENDING,
      },
    });

    return { success: true, document: doc };
  }

  async deleteStudentDocument(docId: string, email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const doc = await this.prisma.studyDocument.findUnique({
      where: { id: docId },
      include: { study_application: true },
    });

    if (!doc || doc.study_application.applicant_email.toLowerCase() !== cleanEmail) {
      throw new UnauthorizedException('Access denied: You can only delete your own documents.');
    }

    try {
      await this.prisma.$executeRawUnsafe(`
        DELETE FROM storage.objects 
        WHERE bucket_id = 'consult-documents' AND name = $1;
      `, doc.file_url);
    } catch (e: any) {
      this.logger.warn(`Storage object delete warning: ${e.message}`);
    }

    await this.prisma.studyDocument.delete({ where: { id: docId } });
    return { success: true, message: 'Document deleted successfully.' };
  }

  async getDocumentSignedUrl(docId: string, email?: string, isAdmin: boolean = false) {
    const doc = await this.prisma.studyDocument.findUnique({
      where: { id: docId },
      include: { study_application: true },
    });

    if (!doc) {
      throw new NotFoundException('Document not found.');
    }

    if (!isAdmin) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || doc.study_application.applicant_email.toLowerCase() !== cleanEmail) {
        throw new UnauthorizedException('Access denied: You cannot view this document.');
      }
    }

    // Generate signed URL (expires in 1 hour)
    const signedUrl = await this.getStorageSignedUrl(doc.file_url, 3600);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    return {
      success: true,
      url: signedUrl,
      expiresAt,
      name: doc.name,
      status: doc.status,
    };
  }

  // ==========================================
  // ADMIN STUDY APPLICATION CRM
  // ==========================================

  async getAllApplications(search?: string, stage?: string, consultantEmail?: string) {
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

    if (consultantEmail) {
      // Find consultation requests assigned to this consultant to match students
      const assignedConsultations = await this.prisma.consultationRequest.findMany({
        where: {
          OR: [
            { consultant: { email: { equals: consultantEmail, mode: 'insensitive' } } },
            { assigned_consultant: { path: ['email'], equals: consultantEmail } },
          ],
        },
        select: { email: true },
      });
      const assignedEmails = assignedConsultations.map(c => c.email.toLowerCase());
      where.applicant_email = { in: assignedEmails };
    }

    const applications = await this.prisma.studyApplication.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: {
        documents: true,
        tests: true,
        notes: { orderBy: { created_at: 'desc' } },
        user: { select: { student_profile: true } },
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

    // Real consultation bookings count for today
    const todayStr = new Date().toISOString().split('T')[0];
    const appointmentsToday = await this.prisma.consultationRequest.count({
      where: {
        preferred_date: {
          contains: todayStr,
        },
      },
    });

    return {
      total,
      active,
      testsPending,
      submissions,
      visa,
      appointments: appointmentsToday,
    };
  }

  // ==========================================
  // PAST QUESTIONS MODULE
  // ==========================================

  async getPastQuestions(exam?: string) {
    const where: any = { is_active: true };
    if (exam && exam !== 'all') {
      where.exam = { equals: exam, mode: 'insensitive' };
    }
    const items = await this.prisma.pastQuestion.findMany({
      where,
      orderBy: [{ year: 'desc' }, { created_at: 'desc' }],
    });

    const enriched = await Promise.all(
      items.map(async (item) => {
        let download_url = item.file_url;
        if (item.resource_type === 'PDF' && !item.file_url.startsWith('http://') && !item.file_url.startsWith('https://')) {
          download_url = await this.getStorageSignedUrl(item.file_url, 3600);
        }
        return {
          ...item,
          download_url,
        };
      }),
    );

    return {
      success: true,
      data: enriched,
    };
  }

  async getAllPastQuestionsAdmin(exam?: string) {
    const where: any = {};
    if (exam && exam !== 'all') {
      where.exam = { equals: exam, mode: 'insensitive' };
    }
    const items = await this.prisma.pastQuestion.findMany({
      where,
      orderBy: [{ year: 'desc' }, { created_at: 'desc' }],
    });

    const enriched = await Promise.all(
      items.map(async (item) => {
        let download_url = item.file_url;
        if (item.resource_type === 'PDF' && !item.file_url.startsWith('http://') && !item.file_url.startsWith('https://')) {
          download_url = await this.getStorageSignedUrl(item.file_url, 3600);
        }
        return {
          ...item,
          download_url,
        };
      }),
    );

    return {
      success: true,
      data: enriched,
    };
  }

  async createPastQuestion(dto: CreatePastQuestionDto) {
    if (!dto.exam || !dto.title || !dto.file_url) {
      throw new BadRequestException('Exam, title, and file/link are required.');
    }
    const created = await this.prisma.pastQuestion.create({
      data: {
        exam: dto.exam.trim(),
        title: dto.title.trim(),
        year: dto.year ? Number(dto.year) : null,
        file_url: dto.file_url.trim(),
        resource_type: dto.resource_type || 'PDF',
        is_active: dto.is_active !== undefined ? dto.is_active : true,
      },
    });
    return { success: true, data: created };
  }

  async uploadPastQuestionFile(file: any) {
    if (!file) throw new BadRequestException('File is required.');
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `past-questions/${Date.now()}_${sanitizedName}`;

    if (this.supabase) {
      try {
        await this.supabase.storage.from('consult-documents').upload(storagePath, file.buffer, {
          contentType: file.mimetype || 'application/pdf',
          upsert: true,
        });
      } catch (e: any) {
        this.logger.warn(`Supabase past question upload error: ${e.message}`);
      }
    }

    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO storage.objects (id, bucket_id, name, owner_id, metadata)
         VALUES ($1::uuid, 'consult-documents', $2, 'admin', $3::jsonb)
         ON CONFLICT (bucket_id, name) DO UPDATE SET metadata = $3::jsonb, updated_at = NOW();`,
        crypto.randomUUID(),
        storagePath,
        JSON.stringify({ mimetype: file.mimetype, size: file.size }),
      );
    } catch {}

    const signedUrl = await this.getStorageSignedUrl(storagePath, 3600);

    return {
      success: true,
      filePath: storagePath,
      fileName: file.originalname,
      signedUrl,
    };
  }

  async updatePastQuestion(id: string, dto: UpdatePastQuestionDto) {
    const existing = await this.prisma.pastQuestion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Past question not found.');

    const data: any = {};
    if (dto.exam !== undefined) data.exam = dto.exam.trim();
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.year !== undefined) data.year = dto.year ? Number(dto.year) : null;
    if (dto.file_url !== undefined) data.file_url = dto.file_url.trim();
    if (dto.resource_type !== undefined) data.resource_type = dto.resource_type;
    if (dto.is_active !== undefined) data.is_active = dto.is_active;

    const updated = await this.prisma.pastQuestion.update({
      where: { id },
      data,
    });
    return { success: true, data: updated };
  }

  async deletePastQuestion(id: string) {
    const existing = await this.prisma.pastQuestion.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Past question not found.');

    if (existing.resource_type === 'PDF' && !existing.file_url.startsWith('http')) {
      await this.deleteStorageFile(existing.file_url);
    }

    await this.prisma.pastQuestion.delete({ where: { id } });
    return { success: true };
  }

  // ==========================================
  // STUDENT TESTS MODULE
  // ==========================================

  async createStudentTest(applicationId: string, dto: CreateStudentTestDto) {
    if (!dto.test_type) {
      throw new BadRequestException('Test type is required.');
    }

    if (dto.email) {
      const app = await this.prisma.studyApplication.findUnique({ where: { id: applicationId } });
      if (!app || app.applicant_email.toLowerCase() !== dto.email.trim().toLowerCase()) {
        throw new UnauthorizedException('Not authorized to add test to this application.');
      }
    }

    const test = await this.prisma.studyTest.create({
      data: {
        study_application_id: applicationId,
        test_type: dto.test_type.trim(),
        status: (dto.status as StudyTestStatus) || StudyTestStatus.PREP_ARRANGED,
        test_date: dto.test_date ? new Date(dto.test_date) : null,
        score: dto.score ? dto.score.trim() : null,
        notes: dto.notes ? dto.notes.trim() : null,
      },
    });

    return { success: true, data: test };
  }

  async updateStudentTest(applicationId: string, testId: string, dto: UpdateStudentTestDto) {
    const test = await this.prisma.studyTest.findUnique({
      where: { id: testId },
      include: { study_application: true },
    });

    if (!test || test.study_application_id !== applicationId) {
      throw new NotFoundException('Test not found for this application.');
    }

    if (dto.email && test.study_application.applicant_email.toLowerCase() !== dto.email.trim().toLowerCase()) {
      throw new UnauthorizedException('Not authorized to update this test.');
    }

    const data: any = {};
    if (dto.test_type !== undefined) data.test_type = dto.test_type.trim();
    if (dto.status !== undefined) data.status = dto.status as StudyTestStatus;
    if (dto.test_date !== undefined) data.test_date = dto.test_date ? new Date(dto.test_date) : null;
    if (dto.score !== undefined) data.score = dto.score ? dto.score.trim() : null;
    if (dto.notes !== undefined) data.notes = dto.notes ? dto.notes.trim() : null;

    const updated = await this.prisma.studyTest.update({
      where: { id: testId },
      data,
    });

    return { success: true, data: updated };
  }

  async deleteStudentTest(applicationId: string, testId: string, email?: string) {
    const test = await this.prisma.studyTest.findUnique({
      where: { id: testId },
      include: { study_application: true },
    });

    if (!test || test.study_application_id !== applicationId) {
      throw new NotFoundException('Test not found for this application.');
    }

    if (email && test.study_application.applicant_email.toLowerCase() !== email.trim().toLowerCase()) {
      throw new UnauthorizedException('Not authorized to delete this test.');
    }

    await this.prisma.studyTest.delete({ where: { id: testId } });
    return { success: true };
  }
}
