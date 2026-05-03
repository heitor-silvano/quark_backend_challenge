import { IsEnum, IsOptional, IsString } from 'class-validator';
import { lead_source, enrichment_status, classification_status } from '@prisma/client';

export class FilterLeadDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEnum(lead_source)
  source?: lead_source;

  @IsOptional()
  @IsEnum(enrichment_status)
  enrichmentStatus?: enrichment_status;

  @IsOptional()
  @IsEnum(classification_status)
  classificationStatus?: classification_status;
}