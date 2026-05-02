import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';
import { QueueService } from 'queue/queue.service';

@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository, private readonly queueService: QueueService) { }
  async create(createLeadDto: CreateLeadDto) {
    return await this.leadsRepository.create(createLeadDto)
  }

  async findAll() {
    return await this.leadsRepository.findAll()
  }

  async findOne(id: string) {
    return await this.leadsRepository.findById(id);
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    return await this.leadsRepository.update(id, updateLeadDto);
  }

  async remove(id: string) {
    return await this.leadsRepository.softDelete(id);
  }

  async enrich(leadId: string) {
    return await this.queueService.publishEnrichment(leadId)
  }

  async classify(leadId: string) {
    return await this.queueService.publishClassification(leadId)
  }
}
