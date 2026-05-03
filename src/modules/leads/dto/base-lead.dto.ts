import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { lead_source } from '@prisma/client';

export class BaseLeadDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'phone must be in E.164 format' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(2, 150)
  companyName?: string;

  @IsOptional()
  @IsUrl()
  companyWebsite?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedValue?: number | null;

  @IsOptional()
  @IsEnum(lead_source)
  source?: lead_source;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string | null;

  @IsOptional()
  @IsString()
  createdBy?: string | null;

  @IsOptional()
  @IsString()
  updatedBy?: string | null;
}