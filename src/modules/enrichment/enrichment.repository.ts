import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnrichmentRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.LeadEnrichmentUncheckedCreateInput) {
    return this.prisma.leadEnrichment.create({ data });
  }

  async update(
    id: string,
    data: Prisma.LeadEnrichmentUncheckedUpdateInput,
  ) {
    return this.prisma.leadEnrichment.update({
      where: { id },
      data,
    });
  }
}
