import { Injectable } from '@nestjs/common';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';

@Injectable()
export class ClassificationService {
  create(createClassificationDto: CreateClassificationDto) {
    return 'This action adds a new classification';
  }

  findAll() {
    return `This action returns all classification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classification`;
  }

  update(id: number, updateClassificationDto: UpdateClassificationDto) {
    return `This action updates a #${id} classification`;
  }

  remove(id: number) {
    return `This action removes a #${id} classification`;
  }
}
