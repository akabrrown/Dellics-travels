import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateConsultationDto {
  @IsOptional()
  @IsIn(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  assignedConsultant?: any;

  @IsOptional()
  @IsString()
  consultantId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  internalNotes?: string;

}

