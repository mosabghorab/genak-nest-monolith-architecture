import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Attachment } from '../../../shared/entities/attachment.entity';
import { UpdateAttachmentStatusDto } from '../dtos/attachments/update-attachment-status.dto';
import { unlinkSync } from 'fs';
import { Constants } from '../../../../core/constants';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Attachment>): Promise<Attachment | null> {
    return this.attachmentRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Attachment>): Promise<Attachment> {
    const attachment: Attachment = await this.findOneById(id, relations);
    if (!attachment) {
      throw new BadRequestException(failureMessage || 'Attachment not found.');
    }
    return attachment;
  }

  // find by vendor id and document id.
  findByVendorIdAndDocumentId(vendorId: number, documentId: number): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { vendorId, documentId },
    });
  }

  // update status.
  async updateStatus(id: number, updateAttachmentStatusDto: UpdateAttachmentStatusDto): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(id);
    attachment.status = updateAttachmentStatusDto.status;
    return this.attachmentRepository.save(attachment);
  }

  // remove one by id.
  async removeOneById(id: number): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(id);
    unlinkSync(Constants.attachmentsPath + attachment.file);
    return this.attachmentRepository.remove(attachment);
  }

  // remove one by instance.
  async removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    unlinkSync(Constants.attachmentsPath + attachment.file);
    return this.attachmentRepository.remove(attachment);
  }
}
