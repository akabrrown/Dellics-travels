import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class AdminLoginInitDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @Length(6, 6)
  otp?: string;
}