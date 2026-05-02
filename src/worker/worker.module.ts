import { Module } from "@nestjs/common";
import { ClassificationModule } from "../modules/classification/classification.module";
import { EnrichmentModule } from "../modules/enrichment/enrichment.module";
import { WorkerService } from "./worker.service";
import { EnrichmentService } from "../modules/enrichment/enrichment.service";
import { ClassificationService } from "../modules/classification/classification.service";

@Module({
  imports: [EnrichmentModule, ClassificationModule],
  providers: [WorkerService, EnrichmentService, ClassificationService],
})
export class WorkerModule {}
