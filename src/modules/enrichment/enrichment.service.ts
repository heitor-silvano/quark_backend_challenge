import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { EnrichmentRepository } from './enrichment.repository';

interface MockApiResponse { //TODO: deixar essa interface como DTO do mock API
  companyName: string;
  tradeName: string;
  cnpj: string;
  industry: string;
  legalNature: string;
  employeeCount: number;
  annualRevenue: number;
  foundedAt: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cnaes: Array<{
    code: string;
    description: string;
    isPrimary: boolean;
  }>;
  partners: Array<{
    name: string;
    cpf: string;
    role: string;
    joinedAt: string;
    phone: string;
    email: string;
  }>;
  phones: Array<{ type: 'commercial' | 'mobile'; number: string }>;
  emails: Array<{ type: string; address: string }>;
}

@Injectable()
export class EnrichmentService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly enrichmentRepository: EnrichmentRepository,
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
      const leadEnrichmentRawData = await this.mockApiInMemory(leadId); //TODO: trocar pelo mock API

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

      throw new Error
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

  private mockApiInMemory(leadId: string): MockApiResponse {
    console.log(`Executing lead ${leadId}`);
    return {
      companyName: 'Tech Corp',
      tradeName: 'Tech Corp Soluções',
      cnpj: '12345678000199',
      industry: 'SaaS',
      legalNature: 'Sociedade Empresária Limitada',
      employeeCount: 120,
      annualRevenue: 1500000,
      foundedAt: '2015-03-10',
      address: {
        street: 'Rua das Inovações',
        number: '500',
        complement: 'Sala 42',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        country: 'BR',
      },
      cnaes: [
        {
          code: '6201-5/00',
          description:
            'Desenvolvimento de programas de computador sob encomenda',
          isPrimary: true,
        },
        {
          code: '6202-3/00',
          description:
            'Desenvolvimento e licenciamento de programas de computador customizáveis',
          isPrimary: false,
        },
      ],
      partners: [
        {
          name: 'Ana Souza',
          cpf: '***.456.789-**',
          role: 'Sócia Administradora',
          joinedAt: '2015-03-10',
          phone: '+55 11 99999-1111',
          email: 'ana.souza@techcorp.com',
        },
        {
          name: 'Carlos Lima',
          cpf: '***.654.321-**',
          role: 'Sócio',
          joinedAt: '2018-07-22',
          phone: '+55 11 98888-2222',
          email: 'carlos.lima@techcorp.com',
        },
      ],
      phones: [
        { type: 'commercial', number: '+55 11 3000-1234' },
        { type: 'mobile', number: '+55 11 99999-5678' },
      ],
      emails: [
        { type: 'commercial', address: 'contato@techcorp.com' },
        { type: 'financial', address: 'financeiro@techcorp.com' },
      ],
    };
  }
}
