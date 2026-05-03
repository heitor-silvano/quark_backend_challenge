import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ENRICHMENT_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'leads_enrichment_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'CLASSIFICATION_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'leads_classification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule { }
