import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Attachment } from '../../shared/entities/attachment.entity';
import { CreateAttachmentDto } from '../dtos/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Attachment>) {
    return this.attachmentRepository.findOne({ where: { id }, relations });
  }

  // find by vendor id and document id.
  findByVendorIdAndDocumentId(
    vendorId: number,
    documentId: number,
    relations?: FindOptionsRelations<Attachment>,
  ) {
    return this.attachmentRepository.find({
      where: { vendorId, documentId },
      relations,
    });
  }

  // remove by vendor id and document id.
  async removeByVendorIdAndDocumentId(vendorId: number, documentId: number) {
    const attachments = await this.attachmentRepository.find({
      where: { vendorId, documentId },
    });
    for (const attachment of attachments) {
      await this.attachmentRepository.remove(attachment);
    }
  }

  // create.
  async create(createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentRepository.save(
      await this.attachmentRepository.create({
        documentId: createAttachmentDto.documentId,
        vendorId: createAttachmentDto.vendorId,
        file: createAttachmentDto.fileName,
      }),
    );
  }
}
