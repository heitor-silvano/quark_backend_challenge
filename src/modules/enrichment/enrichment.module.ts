import { Module } from '@nestjs/common';
import { EnrichmentService } from './enrichment.service';
import { LeadsService } from '../leads/leads.service';
import { EnrichmentRepository } from './enrichment.repository';
import { LeadsRepository } from '../leads/leads.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueueModule } from '../../queue/queue.module';
import { MockApiClient } from './mock-api.client';

@Module({
  controllers: [],
  imports: [QueueModule],
  providers: [
    EnrichmentService,
    LeadsService,
    EnrichmentRepository,
    LeadsRepository,
    PrismaService,
    MockApiClient,
  ],
  exports: [EnrichmentService]
})
export class EnrichmentModule {}
