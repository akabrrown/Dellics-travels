import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { IsNotDisposableEmail } from '../../common/validators/is-not-disposable-email.validator';

export class AdminLoginInitDto {
  @IsEmail()
  @IsNotDisposableEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class AdminLoginDto {
  @IsEmail()
  @IsNotDisposableEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  @Length(6, 6)
  otp?: string;
}
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @Length(8, 128)
  newPassword: string;
}

export class SetupAccountDto {
  @IsEmail()
  @IsNotDisposableEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  @Length(8, 128)
  newPassword: string;
}
