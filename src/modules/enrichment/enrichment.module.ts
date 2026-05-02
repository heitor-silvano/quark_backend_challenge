import { Module } from '@nestjs/common';
import { EnrichmentService } from './enrichment.service';

@Module({
  controllers: [],
  providers: [EnrichmentService],
})
export class EnrichmentModule {}
