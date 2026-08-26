import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInquiryDto {
  @IsIn(['CONTACT', 'INQUIRY'])
  kind: 'CONTACT' | 'INQUIRY';

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9 ()-]{7,20}$/, { message: 'phone looks invalid' })
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  // INQUIRY-only extras
  @IsOptional()
  @IsString()
  @MaxLength(120)
  destination?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'travelDate must be YYYY-MM-DD' })
  travelDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  travelers?: string;
}
