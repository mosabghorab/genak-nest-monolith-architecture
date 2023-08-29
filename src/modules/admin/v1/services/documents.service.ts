import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Document } from '../../../shared/entities/document.entity';
import { CreateDocumentDto } from '../dtos/documents/create-document.dto';
import { UpdateDocumentDto } from '../dtos/documents/update-document.dto';
import { FindAllDocumentsDto } from '../dtos/documents/find-all-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Document>): Promise<Document | null> {
    return this.documentRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Document>): Promise<Document> {
    const document: Document = await this.findOneById(id, relations);
    if (!document) {
      throw new NotFoundException(failureMessage || 'Document not found.');
    }
    return document;
  }

  // find all.
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return this.documentRepository.find({
      where: {
        serviceType: findAllDocumentsDto.serviceType,
        active: findAllDocumentsDto.active,
      },
    });
  }

  // create.
  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentRepository.save(await this.documentRepository.create(createDocumentDto));
  }

  // update.
  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document: Document = await this.findOneOrFailById(id);
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  // remove.
  async remove(id: number): Promise<Document> {
    const document: Document = await this.findOneOrFailById(id);
    return this.documentRepository.remove(document);
  }
}
