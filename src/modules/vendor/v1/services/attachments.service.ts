import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from '../../../shared/entities/attachment.entity';
import { unlinkSync } from 'fs';
import { Constants } from '../../../../core/constants';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  // find by vendor id and document id.
  findByVendorIdAndDocumentId(vendorId: number, documentId: number): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { vendorId, documentId },
    });
  }

  // remove one by instance.
  removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    unlinkSync(Constants.attachmentsPath + attachment.file);
    return this.attachmentRepository.remove(attachment);
  }
}
