import { Catch, ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Catch()
export class RmqExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RmqExceptionFilter.name);

  catch(error: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc().getContext<RmqContext>();
    const channel = ctx.getChannelRef();
    const message = ctx.getMessage();

    this.logger.error(
      `Generic error. ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error.stack : undefined,
    );

    try {
      channel.nack(message, false, false);
    } catch (nackError) {
      this.logger.error('Nack failed', nackError);
    }
  }
}