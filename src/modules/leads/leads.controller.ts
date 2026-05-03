import { Controller, Get, Post, Body, Patch, Param, Delete, Header, StreamableFile, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Readable } from 'stream';
import { FilterLeadDto } from './dto/filter-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="leads.csv"')
  async export(): Promise<StreamableFile> {
    const csv = await this.leadsService.exportCsv();
    const stream = Readable.from([csv]);
    return new StreamableFile(stream);
  }

  @Get()
  findAll(@Query() filters: FilterLeadDto) {
    return this.leadsService.findAll(filters);
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

  @Get(':id/enrichments')
  async enrichments(@Param('id') id: string) {
    return this.leadsService.getEnrichments(id);
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

  @Get(':id/classifications')
  async classifications(@Param('id') id: string) {
    return this.leadsService.getClassifications(id);
  }

  @Post(':id/classification')
  async classification(@Param('id') id: string) {
    await this.leadsService.classify(id);
    return {
      message: 'Classification has been successfully queued',
      leadId: id,
      status: 'PENDING',
    };
  }
}
