import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}
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
}
