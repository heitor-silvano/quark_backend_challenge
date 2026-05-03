import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { lead_source } from '@prisma/client';
import { BaseLeadDto } from './base-lead.dto';

export class CreateLeadDto extends BaseLeadDto {
  @IsString()
  @Length(3, 100)
  declare fullName: string;

  @IsEmail()
  declare email: string;

  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'phone must be in E.164 format' })
  declare phone: string;

  @IsString()
  @Length(2, 150)
  declare companyName: string;

  @IsString()
  @Matches(/^\d{14}$/, { message: 'companyCnpj must have 14 digits' })
  declare companyCnpj: string;

  @IsEnum(lead_source)
  declare source: lead_source;
}