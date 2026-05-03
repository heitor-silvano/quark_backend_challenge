import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  @Get()
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @Post(':id/enrichment')
  async enrichment(@Param('id') id: string) {
    await this.leadsService.enrich(id);

    return {
      message: 'Enrichment has been successfully queued',
      leadId: id,
      status: 'PENDING',
    };
  }

  @Post(':id/classification')
  async classification(@Param('id') id: string) {
    return await this.leadsService.classify(id);
  }
}
