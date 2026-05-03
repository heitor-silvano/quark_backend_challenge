import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClassificationService } from './classification.service';
import { LeadsService } from '../leads/leads.service';
import { ClassificationRepository } from './classification.repository';
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

const mockClassification = {
  id: 'classification-1',
  leadId: 'uuid-1',
  status: 'PENDING',
  requestedAt: new Date(),
};

const mockLeadsService = {
  findOne: vi.fn(),
};

const mockClassificationRepository = {
  create: vi.fn(),
  update: vi.fn(),
};

describe('ClassificationService', () => {
  let service: ClassificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClassificationService(
      mockLeadsService as unknown as LeadsService,
      mockClassificationRepository as unknown as ClassificationRepository,
    );
  });

  describe('execute', () => {
    it('should throw NotFoundException when lead does not exist', async () => {
      mockLeadsService.findOne.mockResolvedValue(null);

      await expect(service.execute('non-existent'))
        .rejects.toThrow(NotFoundException);

      expect(mockClassificationRepository.create).not.toHaveBeenCalled();
    });

    it('should create classification with PENDING status initially', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      const ollamaResponse = JSON.stringify({
        score: 85,
        justification: 'High value lead from website',
      });

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: ollamaResponse }),
      } as Response);

      mockClassificationRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockClassificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          leadId: 'uuid-1',
          status: 'PENDING',
        }),
      );
    });

    it('should update classification with SUCCESS and correct score', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      const ollamaResponse = JSON.stringify({
        score: 85,
        justification: 'High value lead from website',
      });

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: ollamaResponse }),
      } as Response);

      mockClassificationRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockClassificationRepository.update).toHaveBeenCalledWith(
        'classification-1',
        expect.objectContaining({
          status: 'SUCCESS',
          score: 85,
          classification: 'Hot',
          commercialPotential: 'High',
          completedAt: expect.any(Date),
        }),
      );
    });

    it('should classify as Warm when score is between 40 and 69', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: JSON.stringify({ score: 55, justification: 'Moderate lead' }),
        }),
      } as Response);

      mockClassificationRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockClassificationRepository.update).toHaveBeenCalledWith(
        'classification-1',
        expect.objectContaining({
          score: 55,
          classification: 'Warm',
          commercialPotential: 'Medium',
        }),
      );
    });

    it('should classify as Cold when score is below 40', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: JSON.stringify({ score: 20, justification: 'Low value lead' }),
        }),
      } as Response);

      mockClassificationRepository.update.mockResolvedValue({});

      await service.execute('uuid-1');

      expect(mockClassificationRepository.update).toHaveBeenCalledWith(
        'classification-1',
        expect.objectContaining({
          score: 20,
          classification: 'Cold',
          commercialPotential: 'Low',
        }),
      );
    });

    it('should update classification with FAILED status when ollama fails', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      mockClassificationRepository.update.mockResolvedValue({});

      await expect(service.execute('uuid-1')).rejects.toThrow();

      expect(mockClassificationRepository.update).toHaveBeenCalledWith(
        'classification-1',
        expect.objectContaining({
          status: 'FAILED',
          completedAt: expect.any(Date),
        }),
      );
    });

    it('should propagate error after saving FAILED status', async () => {
      mockLeadsService.findOne.mockResolvedValue(mockLead);
      mockClassificationRepository.create.mockResolvedValue(mockClassification);

      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Connection refused'));

      mockClassificationRepository.update.mockResolvedValue({});

      await expect(service.execute('uuid-1'))
        .rejects.toThrow('Connection refused');
    });
  });
});