import { Module } from '@nestjs/common';
import { EnrichmentModule } from '../modules/enrichment/enrichment.module';
import { QueueModule } from '../queue/queue.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ClassificationModule } from '../modules/classification/classification.module';
import { LeadsModule } from '../modules/leads/leads.module';
import { EnrichmentConsumer } from './consumers/enrichment.consumer';
import { ClassificationConsumer } from './consumers/classification.consumer';

@Module({
  imports: [EnrichmentModule, QueueModule, ClassificationModule, LeadsModule],
  providers: [PrismaService],
  controllers: [EnrichmentConsumer, ClassificationConsumer],
})
export class WorkerModule {
}
