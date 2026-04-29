import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Module({
  controllers: [],
  providers: [QueueService],
})
export class QueueModule {}
