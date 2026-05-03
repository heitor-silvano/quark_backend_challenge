import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EnrichmentService } from '../../modules/enrichment/enrichment.service';

@Controller()
export class EnrichmentConsumer {
  constructor(private readonly enrichmentService: EnrichmentService) {}

  @EventPattern('lead.enrichment')
  async handle(
    @Payload() data: { leadId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.enrichmentService.execute(data.leadId);
      channel.ack(message);
    } catch (err) {
      console.log(err)
      channel.nack(message, false, false);
    }
  }
}