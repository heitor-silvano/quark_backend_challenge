import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationRepository } from './classification.repository';
import { LeadsService } from '../leads/leads.service';
import { LeadsRepository } from '../leads/leads.repository';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueueModule } from '../../queue/queue.module';

@Module({
  controllers: [],
  imports: [QueueModule],
  providers: [
    ClassificationService,
    ClassificationRepository,
    LeadsService,
    LeadsRepository,
    PrismaService,
  ],
  exports: [ClassificationService],
})
export class ClassificationModule { }
