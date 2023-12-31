import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../../shared/entities/document.entity';
import { ServiceType } from '../../../shared/enums/service-type.enum';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find all.
  findAll(serviceType: ServiceType): Promise<Document[]> {
    return this.documentRepository.find({
      where: { serviceType, active: true },
    });
  }
}
