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
}