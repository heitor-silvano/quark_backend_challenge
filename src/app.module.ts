import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './modules/leads/leads.module';
import { EnrichmentModule } from './modules/enrichment/enrichment.module';
import { ClassificationModule } from './modules/classification/classification.module';
import { ConfigModule } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [ConfigModule.forRoot(), LeadsModule, EnrichmentModule, ClassificationModule, WorkerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
