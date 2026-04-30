import {
  IsEmail,
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

export class CreateLeadDto {
  @IsString()
  @Length(3, 100)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\+\d{10,15}$/, {
    message: 'phone must be in E.164 format',
  })
  phone!: string;

  @IsString()
  @Length(2, 150)
  companyName!: string;

  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'companyCnpj must have 14 digits',
  })
  companyCnpj!: string;

  @IsOptional()
  @IsUrl()
  companyWebsite?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedValue?: number | null;

  @IsEnum(lead_source)
  source!: lead_source;

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