import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { ClassificationService } from "../../modules/classification/classification.service";

@Controller()
export class ClassificationConsumer {
  constructor(private readonly classificationService: ClassificationService) { }

  @EventPattern('lead.classification')
  async handle(
    @Payload() data: { leadId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.classificationService.execute(data.leadId);
      channel.ack(message);
    } catch (err) {
      channel.nack(message, false, false);
    }
  }
}