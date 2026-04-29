import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrichmentService } from './enrichment.service';
import { CreateEnrichmentDto } from './dto/create-enrichment.dto';
import { UpdateEnrichmentDto } from './dto/update-enrichment.dto';

@Controller('enrichment')
export class EnrichmentController {
  constructor(private readonly enrichmentService: EnrichmentService) {}

  @Post()
  create(@Body() createEnrichmentDto: CreateEnrichmentDto) {
    return this.enrichmentService.create(createEnrichmentDto);
  }

  @Get()
  findAll() {
    return this.enrichmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrichmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrichmentDto: UpdateEnrichmentDto) {
    return this.enrichmentService.update(+id, updateEnrichmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrichmentService.remove(+id);
  }
}
