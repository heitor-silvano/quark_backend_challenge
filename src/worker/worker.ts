import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';
import { RmqExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'leads_enrichment_queue',
      noAck: false,
      prefetchCount: 1,
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'leads_classification_queue',
      noAck: false,
      prefetchCount: 1,
      queueOptions: { durable: true },
    },
  });

  app.useGlobalFilters(new RmqExceptionFilter());
  await app.startAllMicroservices();
}

bootstrap();