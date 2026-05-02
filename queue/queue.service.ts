import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class QueueService {
  constructor(
    @Inject('ENRICHMENT_QUEUE') private readonly enrichmentClient: ClientProxy,
    @Inject('CLASSIFICATION_QUEUE') private readonly classificationService: ClientProxy,
  ) { }

  async publishEnrichment(leadId: string) {
    this.enrichmentClient.emit('lead.enrichment', { leadId })
  }

  async publishClassification(leadId: string) {
    return this.classificationService.emit('lead.classification', { leadId });
  }
}
