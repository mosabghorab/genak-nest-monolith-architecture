import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Attachment } from '../../shared/entities/attachment.entity';

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

  // remove.
  async remove(id: number) {
    const attachment = await this.findOneById(id);
    if (!attachment) {
      throw new NotFoundException('Attachment not found.');
    }
    return this.attachmentRepository.remove(attachment);
  }
}
