import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyDocumentStatus, StudyTestStatus } from '@prisma/client';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Get('metrics')
  async getMetrics() {
    return this.studyService.getMetrics();
  }

  @Get('applications')
  async getApplications(
    @Query('search') search?: string,
    @Query('stage') stage?: string,
  ) {
    return this.studyService.getAllApplications(search, stage);
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

  @Patch('applications/:id/tests/:testId')
  async updateTest(
    @Param('id') id: string,
    @Param('testId') testId: string,
    @Body() body: { status?: StudyTestStatus; score?: string },
  ) {
    return this.studyService.updateTestStatus(id, testId, body);
  }

  @Post('applications/:id/notes')
  async addNote(
    @Param('id') id: string,
    @Body() body: { author_name: string; text: string },
  ) {
    return this.studyService.addNote(id, body);
  }
}
