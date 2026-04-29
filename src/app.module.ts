import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './modules/leads/leads.module';
import { EnrichmentModule } from './modules/enrichment/enrichment.module';
import { ClassificationModule } from './modules/classification/classification.module';

@Module({
  imports: [LeadsModule, EnrichmentModule, ClassificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
