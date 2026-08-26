import {
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SearchHotelsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  destination: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'checkIn must be YYYY-MM-DD' })
  checkIn: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'checkOut must be YYYY-MM-DD' })
  checkOut: string;

  @IsInt()
  @Min(1)
  @Max(16)
  guests: number;

  @IsInt()
  @Min(1)
  @Max(8)
  rooms: number;
}
