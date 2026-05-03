import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { EnrichmentRepository } from './enrichment.repository';
import { MockApiResponse } from './dto/mock-api.dto';
import { MockApiClient } from './mock-api.client';

@Injectable()
export class EnrichmentService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly enrichmentRepository: EnrichmentRepository,
    private readonly mockApiClient: MockApiClient,
  ) { }
  async execute(leadId: string) {
    const lead = await this.leadsService.findOne(leadId);

    if (!lead) {
      throw new NotFoundException(`Lead ${leadId} was not found.`);
    }

    const enrichment = await this.enrichmentRepository.create({
      leadId,
      status: 'PENDING',
      requestedAt: new Date(),
    });

    try {
      const leadEnrichmentRawData = await this.mockApiClient.getCompanyByCnpj(lead.companyCnpj);

      const leadEnrichedData = this.mapToPayload(leadEnrichmentRawData);

      await this.enrichmentRepository.update(enrichment.id, {
        leadId,
        ...leadEnrichedData,
        fullName: lead.fullName,
        companyWebsite: lead.companyWebsite,
        source: lead.source,
        notes: lead.notes,
        status: 'SUCCESS',
        rawData: JSON.stringify(leadEnrichmentRawData),
        completedAt: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      await this.enrichmentRepository.update(enrichment.id, {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage: errorMessage
      });

      throw error
    }
  }

  private mapToPayload(rawData: MockApiResponse) {
    return {
      email: rawData.emails?.[0]?.address ?? null,
      phone: rawData.phones?.[0]?.number ?? null,
      companyName: rawData.companyName,
      companyCnpj: rawData.cnpj,
      estimatedValue: rawData.annualRevenue,
    };
  }
}
