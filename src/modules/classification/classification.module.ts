import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';

@Module({
  controllers: [],
  providers: [ClassificationService],
})
export class ClassificationModule {}
