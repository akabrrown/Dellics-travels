import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  currentEducation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  desiredDegree?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  desiredProgram: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  preferredDestination: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  targetIntake?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  testStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  budgetRange?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  consultationMode: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

