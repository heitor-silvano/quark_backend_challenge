import { Injectable } from '@nestjs/common';
import { Lead, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) { }

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

  async findAll(): Promise<Lead[]> {
    return this.prisma.lead.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(id: string, data: Prisma.LeadUpdateInput): Promise<Lead> {
    return this.prisma.lead.update({
      where: { id },
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