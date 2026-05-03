import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './leads.repository';
import { QueueService } from '../../queue/queue.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
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

const mockLeadsRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
  findEnrichments: vi.fn(),
  findClassifications: vi.fn(),
  findAllForExport: vi.fn(),
};

const mockQueueService = {
  publishEnrichment: vi.fn(),
  publishClassification: vi.fn(),
};

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LeadsService(
      mockLeadsRepository as unknown as LeadsRepository,
      mockQueueService as unknown as QueueService,
    );
  });

  describe('create', () => {
    it('should create a lead', async () => {
      mockLeadsRepository.create.mockResolvedValue(mockLead);

      const result = await service.create({
        fullName: mockLead.fullName,
        email: mockLead.email,
        phone: mockLead.phone,
        companyName: mockLead.companyName,
        companyCnpj: mockLead.companyCnpj,
        source: mockLead.source,
      });

      expect(mockLeadsRepository.create).toHaveBeenCalledOnce();
      expect(result).toEqual(mockLead);
    });
  });

  describe('findOne', () => {
    it('should return a lead by id', async () => {
      mockLeadsRepository.findById.mockResolvedValue(mockLead);

      const result = await service.findOne('uuid-1');

      expect(mockLeadsRepository.findById).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockLead);
    });

    it('should return null when lead does not exist', async () => {
      mockLeadsRepository.findById.mockResolvedValue(null);

      const result = await service.findOne('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a lead', async () => {
      mockLeadsRepository.findById.mockResolvedValue(mockLead);
      mockLeadsRepository.update.mockResolvedValue({
        ...mockLead,
        fullName: 'João Atualizado',
      });

      const result = await service.update('uuid-1', { fullName: 'João Atualizado' });

      expect(mockLeadsRepository.update).toHaveBeenCalledWith('uuid-1', { fullName: 'João Atualizado' });
      expect(result.fullName).toBe('João Atualizado');
    });

    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent', { fullName: 'João' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a lead', async () => {
      mockLeadsRepository.softDelete.mockResolvedValue(undefined);

      await service.remove('uuid-1');

      expect(mockLeadsRepository.softDelete).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('enrich', () => {
    it('should publish enrichment to queue', async () => {
      mockLeadsRepository.findById.mockResolvedValue(mockLead);
      mockQueueService.publishEnrichment.mockResolvedValue(undefined);

      await service.enrich('uuid-1');

      expect(mockQueueService.publishEnrichment).toHaveBeenCalledWith('uuid-1');
    });

    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsRepository.findById.mockResolvedValue(null);

      await expect(service.enrich('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('classify', () => {
    it('should publish classification to queue', async () => {
      mockLeadsRepository.findById.mockResolvedValue(mockLead);
      mockQueueService.publishClassification.mockResolvedValue(undefined);

      await service.classify('uuid-1');

      expect(mockQueueService.publishClassification).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('getEnrichments', () => {
    it('should return enrichments for a lead', async () => {
      const enrichments = [{ id: 'enrich-1', leadId: 'uuid-1', status: 'SUCCESS' }];
      mockLeadsRepository.findById.mockResolvedValue(mockLead);
      mockLeadsRepository.findEnrichments.mockResolvedValue(enrichments);

      const result = await service.getEnrichments('uuid-1');

      expect(result).toEqual(enrichments);
    });

    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsRepository.findById.mockResolvedValue(null);

      await expect(service.getEnrichments('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getClassifications', () => {
    it('should return classifications for a lead', async () => {
      const classifications = [{ id: 'class-1', leadId: 'uuid-1', status: 'SUCCESS', score: 92 }];
      mockLeadsRepository.findById.mockResolvedValue(mockLead);
      mockLeadsRepository.findClassifications.mockResolvedValue(classifications);

      const result = await service.getClassifications('uuid-1');

      expect(result).toEqual(classifications);
    });

    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsRepository.findById.mockResolvedValue(null);

      await expect(service.getClassifications('non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });
});