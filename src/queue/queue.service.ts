import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class QueueService {
  constructor(
    @Inject('ENRICHMENT_QUEUE') private readonly enrichmentClient: ClientProxy,
    @Inject('CLASSIFICATION_QUEUE') private readonly classificationService: ClientProxy,
  ) { }

  async publishEnrichment(leadId: string) {
    return await lastValueFrom(
      this.enrichmentClient.emit('lead.enrichment', { leadId })
    )
  }

  async publishClassification(leadId: string) {
    return await lastValueFrom(
      this.classificationService.emit('lead.classification', { leadId })
    )
  }
}
