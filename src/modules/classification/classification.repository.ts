import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.LeadClassificationUncheckedCreateInput) {
    return this.prisma.leadClassification.create({ data });
  }

  async update(id: string, data: Prisma.LeadClassificationUncheckedUpdateInput) {
    return this.prisma.leadClassification.update({
      where: { id },
      data,
    });
  }

  async findAllByLeadId(leadId: string) {
    return this.prisma.leadClassification.findMany({
      where: { leadId },
      orderBy: { requestedAt: 'desc' },
    });
  }
}