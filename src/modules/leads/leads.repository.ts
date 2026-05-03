import { Injectable } from '@nestjs/common';
import { Lead, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LeadCreateInput): Promise<Lead> {
    return this.prisma.lead.create({ data });
  }

  async findById(id: string): Promise<Lead | null> {
    return this.prisma.lead.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findAll(filters?: FilterLeadDto): Promise<Lead[]> {
    return this.prisma.lead.findMany({
      where: {
        deletedAt: null,
        ...(filters?.fullName && {
          fullName: { contains: filters.fullName, mode: 'insensitive' },
        }),
        ...(filters?.companyName && {
          companyName: { contains: filters.companyName, mode: 'insensitive' },
        }),
        ...(filters?.source && {
          source: filters.source,
        }),
        ...(filters?.enrichmentStatus && {
          leadEnrichments: {
            some: { status: filters.enrichmentStatus },
          },
        }),
        ...(filters?.classificationStatus && {
          leadClassifications: {
            some: { status: filters.classificationStatus },
          },
        }),
      },
    });
  }

  async update(id: string, data: Prisma.LeadUpdateInput): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.lead.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findEnrichments(leadId: string) {
    return this.prisma.leadEnrichment.findMany({
      where: { leadId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findClassifications(leadId: string) {
    return this.prisma.leadClassification.findMany({
      where: { leadId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findAllForExport() {
    return this.prisma.lead.findMany({
      where: { deletedAt: null },
      include: {
        leadEnrichments: {
          orderBy: { requestedAt: 'desc' },
          take: 1,
        },
        leadClassifications: {
          orderBy: { requestedAt: 'desc' },
          take: 1,
        },
      },
    });
  }
}