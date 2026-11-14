import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudyService } from './study.service';
import { StudyDocumentStatus, StudyTestStatus } from '@prisma/client';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
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

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  // ==========================================
  // STUDENT AUTH & VERIFICATION ENDPOINTS
  // ==========================================

  @Post('auth/send-code')
  async sendCode(@Body() body: SendCodeDto) {
    return this.studyService.sendVerificationCode(body);
  }

  @Post('auth/verify-code')
  async verifyCode(@Body() body: VerifyCodeDto) {
    return this.studyService.verifyCode(body);
  }

  @Post('auth/signup')
  async signup(@Body() body: StudentSignupDto) {
    return this.studyService.studentSignup(body);
  }

  @Post('auth/login')
  async login(@Body() body: StudentLoginDto) {
    return this.studyService.studentLogin(body);
  }

  @Post('onboarding')
  async saveOnboarding(@Body() body: StudentOnboardingDto) {
    return this.studyService.saveOnboarding(body);
  }

  @Get('portal/me')
  async getPortalData(@Query('email') email: string) {
    return this.studyService.getStudentPortalData(email);
  }

  @Post('applications/:id/documents/upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(file.mimetype)) {
        return cb(new BadRequestException('Only PDF, JPG, and PNG files up to 10MB are permitted.'), false);
      }
      cb(null, true);
    },
  }))
  async uploadFile(
    @Param('id') id: string,
    @Query('email') email: string,
    @Body('name') name: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return this.studyService.uploadStudentDocument(id, email, {
      name: name || file.originalname,
      file_url: base64Data,
      size_bytes: file.size,
      mime_type: file.mimetype,
    });
  }

  @Delete('documents/:docId')
  async deleteDocument(@Param('docId') docId: string, @Query('email') email: string) {
    return this.studyService.deleteStudentDocument(docId, email);
  }

  @Get('documents/:docId/download-url')
  async getDocumentDownloadUrl(
    @Param('docId') docId: string,
    @Query('email') email?: string,
    @Query('admin') admin?: string,
  ) {
    const isAdmin = admin === 'true';
    return this.studyService.getDocumentSignedUrl(docId, email, isAdmin);
  }

  // ==========================================
  // ADMIN STUDY CRM & DASHBOARD STATS
  // ==========================================

  @Get('metrics')
  async getMetrics() {
    return this.studyService.getMetrics();
  }

  @Get('applications')
  @UseGuards(AdminAuthGuard)
  async getApplications(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('stage') stage?: string,
  ) {
    const user = req.user;
    const isConsultantOnly = user?.roleId === 'consultant';
    return this.studyService.getAllApplications(search, stage, isConsultantOnly ? user.email : undefined);
  }

  @Patch('applications/:id')
  async updateApplication(@Param('id') id: string, @Body() body: any) {
    return this.studyService.updateApplication(id, body);
  }

  @Post('applications/:id/documents')
  async addDocument(
    @Param('id') id: string,
    @Body() body: { name: string; file_url: string },
  ) {
    return this.studyService.createDocument(id, body);
  }

  @Patch('applications/:id/documents/:docId')
  async updateDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Body() body: { status: StudyDocumentStatus },
  ) {
    return this.studyService.updateDocumentStatus(id, docId, body.status);
  }

  @Post('applications/:id/tests')
  async addTest(
    @Param('id') id: string,
    @Body() body: CreateStudentTestDto,
  ) {
    return this.studyService.createStudentTest(id, body);
  }

  @Patch('applications/:id/tests/:testId')
  async updateTest(
    @Param('id') id: string,
    @Param('testId') testId: string,
    @Body() body: UpdateStudentTestDto,
  ) {
    return this.studyService.updateStudentTest(id, testId, body);
  }

  @Delete('applications/:id/tests/:testId')
  async deleteTest(
    @Param('id') id: string,
    @Param('testId') testId: string,
    @Query('email') email?: string,
  ) {
    return this.studyService.deleteStudentTest(id, testId, email);
  }

  @Post('applications/:id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() body: { author_name: string; text: string },
  ) {
    return this.studyService.addNote(id, body);
  }

  // ==========================================
  // PAST QUESTIONS ENDPOINTS
  // ==========================================

  @Get('past-questions')
  async getPastQuestions(@Query('exam') exam?: string) {
    return this.studyService.getPastQuestions(exam);
  }

  @Get('past-questions/admin')
  @UseGuards(AdminAuthGuard)
  async getPastQuestionsAdmin(@Query('exam') exam?: string) {
    return this.studyService.getAllPastQuestionsAdmin(exam);
  }

  @Post('past-questions/upload')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  }))
  async uploadPastQuestionFile(@UploadedFile() file: any) {
    return this.studyService.uploadPastQuestionFile(file);
  }

  @Post('past-questions')
  @UseGuards(AdminAuthGuard)
  async createPastQuestion(@Body() body: CreatePastQuestionDto) {
    return this.studyService.createPastQuestion(body);
  }

  @Patch('past-questions/:id')
  @UseGuards(AdminAuthGuard)
  async updatePastQuestion(
    @Param('id') id: string,
    @Body() body: UpdatePastQuestionDto,
  ) {
    return this.studyService.updatePastQuestion(id, body);
  }

  @Delete('past-questions/:id')
  @UseGuards(AdminAuthGuard)
  async deletePastQuestion(@Param('id') id: string) {
    return this.studyService.deletePastQuestion(id);
  }
}
