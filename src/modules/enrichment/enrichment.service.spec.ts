import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnrichmentService } from './enrichment.service';
import { LeadsService } from '../leads/leads.service';
import { EnrichmentRepository } from './enrichment.repository';
import { MockApiClient } from './mock-api.client';
import { NotFoundException } from '@nestjs/common';
import { lead_source } from '@prisma/client';

const mockLead = {
  id: 'uuid-1',
  fullName: 'João da Silva',
  email: 'joao@techcorp.com.br',
  phone: '+5511999991111',
  companyName: 'Tech Corp',
  companyCnpj: '11222333000181',
  companyWebsite: 'https://techcorp.com.br',
  estimatedValue: 150000,
  source: lead_source.WEBSITE,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null,
  updatedBy: null,
  deletedAt: null,
};

const mockEnrichment = {
  id: 'enrichment-1',
  leadId: 'uuid-1',
  status: 'PENDING',
  requestedAt: new Date(),
};

const mockApiResponse = {
  companyName: 'Tech Corp',
  tradeName: 'Tech Corp Soluções',
  cnpj: '11222333000181',
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
  cnaes: [],
  partners: [],
  phones: [{ type: 'commercial' as const, number: '+55 11 3000-1234' }],
  emails: [{ type: 'commercial', address: 'contato@techcorp.com' }],
};

const mockLeadsService = {
  findOne: vi.fn(),
};

const mockEnrichmentRepository = {
  create: vi.fn(),
  update: vi.fn(),
};

const mockMockApiClient = {
  getCompanyByCnpj: vi.fn(),
};

describe('EnrichmentService', () => {
  let service: EnrichmentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EnrichmentService(
      mockLeadsService as unknown as LeadsService,
      mockEnrichmentRepository as unknown as EnrichmentRepository,
      mockMockApiClient as unknown as MockApiClient,
    );
  });

  describe('execute', () => {
    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsService.findOne.mockResolvedValue(null);

      await expect(service.execute('non-existent'))
        .rejects.toThrow(NotFoundException);

      expect(mockEnrichmentRepository.create).not.toHaveBeenCalled();
    });

    it('should create enrichment with PENDING status initially', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockEnrichmentRepository.create.mockResolvedValue(mockEnrichment);
      mockMockApiClient.getCompanyByCnpj.mockResolvedValue(mockApiResponse);
      mockEnrichmentRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockEnrichmentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          leadId: 'uuid-1',
          status: 'PENDING',
        }),
      );
    });

    it('should call mock api with lead companyCnpj', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockEnrichmentRepository.create.mockResolvedValue(mockEnrichment);
      mockMockApiClient.getCompanyByCnpj.mockResolvedValue(mockApiResponse);
      mockEnrichmentRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockMockApiClient.getCompanyByCnpj).toHaveBeenCalledWith('11222333000181');
    });

    it('should update enrichment with SUCCESS status after api call', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockEnrichmentRepository.create.mockResolvedValue(mockEnrichment);
      mockMockApiClient.getCompanyByCnpj.mockResolvedValue(mockApiResponse);
      mockEnrichmentRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockEnrichmentRepository.update).toHaveBeenCalledWith(
        'enrichment-1',
        expect.objectContaining({
          status: 'SUCCESS',
          completedAt: expect.any(Date),
          email: 'contato@techcorp.com',
          phone: '+55 11 3000-1234',
          companyName: 'Tech Corp',
          companyCnpj: '11222333000181',
        }),
      );
    });

    it('should update enrichment with FAILED status when api call fails', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockEnrichmentRepository.create.mockResolvedValue(mockEnrichment);
      mockMockApiClient.getCompanyByCnpj.mockRejectedValue(new Error('API timeout'));
      mockEnrichmentRepository.update.mockResolvedValue({});

      await expect(service.execute('uuid-1')).rejects.toThrow('API timeout');

      expect(mockEnrichmentRepository.update).toHaveBeenCalledWith(
        'enrichment-1',
        expect.objectContaining({
          status: 'FAILED',
          errorMessage: 'API timeout',
          completedAt: expect.any(Date),
        }),
      );
    });

    it('should propagate error after saving FAILED status', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockEnrichmentRepository.create.mockResolvedValue(mockEnrichment);
      mockMockApiClient.getCompanyByCnpj.mockRejectedValue(new Error('Connection refused'));
      mockEnrichmentRepository.update.mockResolvedValue({});

      await expect(service.execute('uuid-1'))
        .rejects.toThrow('Connection refused');
    });
  });
});