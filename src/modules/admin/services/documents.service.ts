import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Document } from '../../shared/entities/document.entity';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { UpdateDocumentDto } from '../dtos/update-document.dto';
import { FindAllDocumentsDto } from '../dtos/find-all-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find one by id.
  async findOneById(id: number, relations?: FindOptionsRelations<Document>) {
    return this.documentRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  findAll(
    findAllDocumentsDto: FindAllDocumentsDto,
    relations?: FindOptionsRelations<Document>,
  ) {
    return this.documentRepository.find({
      where: {
        serviceType: findAllDocumentsDto.serviceType,
        active: findAllDocumentsDto.active,
      },
      relations,
    });
  }

  // create.
  async create(createDocumentDto: CreateDocumentDto) {
    return this.documentRepository.save(
      await this.documentRepository.create(createDocumentDto),
    );
  }

  // update.
  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOneById(id);
    if (!document) {
      throw new NotFoundException('Document not found.');
    }
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  // remove.
  async remove(id: number) {
    const document = await this.findOneById(id);
    if (!document) {
      throw new NotFoundException('Document not found.');
    }
    return this.documentRepository.remove(document);
  }
}
