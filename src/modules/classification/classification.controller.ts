import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Post()
  create(@Body() createClassificationDto: CreateClassificationDto) {
    return this.classificationService.create(createClassificationDto);
  }

  @Get()
  findAll() {
    return this.classificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificationDto: UpdateClassificationDto) {
    return this.classificationService.update(+id, updateClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificationService.remove(+id);
  }
}
