import { IsString, IsNotEmpty, IsEmail, IsArray, ValidateNested, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GuestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsBoolean()
  isChild: boolean;

  @IsOptional()
  @IsNumber()
  age?: number;
}

export class ContactDetailsDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class BookHotelDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  rateId: string;

  @IsString()
  @IsNotEmpty()
  provider: string; // 'ratehawk', 'hotelbeds', etc.

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  currency: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];

  @ValidateNested()
  @Type(() => ContactDetailsDto)
  contactDetails: ContactDetailsDto;
}
