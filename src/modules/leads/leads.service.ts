import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';
import { QueueService } from '../../queue/queue.service';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository, private readonly queueService: QueueService) { }
  async create(createLeadDto: CreateLeadDto) {
    return await this.leadsRepository.create(createLeadDto)
  }

  async findAll(filters?: FilterLeadDto) {
    return this.leadsRepository.findAll(filters);
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

  async getEnrichments(leadId: string) {
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new NotFoundException(`Lead ${leadId} was not found`);
    return this.leadsRepository.findEnrichments(leadId);
  }

  async getClassifications(leadId: string) {
    const lead = await this.leadsRepository.findById(leadId);
    if (!lead) throw new NotFoundException(`Lead ${leadId} was not found`);
    return this.leadsRepository.findClassifications(leadId);
  }

  async exportCsv(): Promise<string> {
    const leads = await this.leadsRepository.findAllForExport();

    const headers = [
      'id', 'fullName', 'email', 'phone', 'companyName', 'companyCnpj',
      'companyWebsite', 'estimatedValue', 'source', 'notes',
      'enrichmentStatus', 'enrichmentCompletedAt',
      'classificationScore', 'classificationLabel',
      'classificationPotential', 'classificationCompletedAt',
    ].join(',');

    const rows = leads.map((lead) => {
      const enrichment = lead.leadEnrichments[0] ?? null;
      const classification = lead.leadClassifications[0] ?? null;

      return [
        lead.id,
        this.escapeCsv(lead.fullName),
        this.escapeCsv(lead.email),
        this.escapeCsv(lead.phone),
        this.escapeCsv(lead.companyName),
        lead.companyCnpj,
        this.escapeCsv(lead.companyWebsite ?? ''),
        lead.estimatedValue?.toString() ?? '',
        lead.source,
        this.escapeCsv(lead.notes ?? ''),
        enrichment?.status ?? '',
        enrichment?.completedAt?.toISOString() ?? '',
        classification?.score?.toString() ?? '',
        classification?.classification ?? '',
        classification?.commercialPotential ?? '',
        classification?.completedAt?.toISOString() ?? '',
      ].join(',');
    });

    return [headers, ...rows].join('\n');
  }

  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
