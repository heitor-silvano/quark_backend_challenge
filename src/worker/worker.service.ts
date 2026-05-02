import { Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EnrichmentService } from '../modules/enrichment/enrichment.service';
import { ClassificationService } from '../modules/classification/classification.service';

@Injectable()
export class WorkerService {
  constructor(
    private readonly enrichmentService: EnrichmentService,
    private readonly classificationService: ClassificationService,
  ) {}

  @EventPattern('lead.enrichment')
  async handleEnrichment(
    @Payload() data: { leadId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.enrichmentService.execute(data.leadId);
      channel.ack(message);
    } catch (error) {
      console.error('Enrichment error:', error);
      channel.nack(message);
    }
  }

  @EventPattern('lead.classification')
  async handleClassification(
    @Payload() data: { leadId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.classificationService.execute(data.leadId);
      channel.ack(message);
    } catch (error) {
      console.error('Classification error:', error);
      channel.nack(message);
    }
  }
}