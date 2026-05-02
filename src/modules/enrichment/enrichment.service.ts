import { Injectable } from '@nestjs/common';
import { CreateEnrichmentDto } from './dto/create-enrichment.dto';
import { UpdateEnrichmentDto } from './dto/update-enrichment.dto';

@Injectable()
export class EnrichmentService {
  async execute (leadId: string) {
    //TODO: implementar
  }
}
