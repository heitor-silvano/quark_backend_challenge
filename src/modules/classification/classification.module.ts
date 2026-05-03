import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';

@Module({
  controllers: [],
  providers: [ClassificationService],
  exports: [ClassificationService]
})
export class ClassificationModule {}
