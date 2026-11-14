import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultantsController } from './consultants.controller';
import { ConsultationsService } from './consultations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ConsultationsController, ConsultantsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}


