import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadsRepository } from './leads.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, LeadsRepository, PrismaService],
})
export class LeadsModule {}
