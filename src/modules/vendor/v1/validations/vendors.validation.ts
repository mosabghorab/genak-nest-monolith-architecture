import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { LocationsService } from '../../../shared/v1/services/locations.service';
import { VendorsService } from '../services/vendors.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { DocumentsService } from '../services/documents.service';
import { Document } from '../../../shared/entities/document.entity';
import { CreateAttachmentDto } from '../dtos/create-attachment.dto';
import { AttachmentStatus } from '../../../shared/enums/attachment-status.enum';
import { DocumentType } from '../../../shared/enums/document-type.enum';
import { ImageExtension } from '../../../shared/enums/image-extension.enum';
import { Helpers } from '../../../../core/helpers/helpers';
import { FileExtension } from '../../../shared/enums/file-extension.enum';
import { Attachment } from '../../../shared/entities/attachment.entity';

@Injectable()
export class VendorsValidation {
  constructor(
    @Inject(forwardRef(() => VendorsService))
    private readonly vendorsService: VendorsService,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
  ) {}

  // validate creation.
  async validateCreation(signUpDto: SignUpDto): Promise<void> {
    const vendor: Vendor = await this.vendorsService.findOneByPhone(signUpDto.phone);
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    await this.locationsService.findOneOrFailById(signUpDto.governorateId, 'Governorate not found.');
  }

  // validate update.
  async validateUpdate(vendorId: number, updateProfileDto: UpdateProfileDto): Promise<Vendor> {
    const vendor: Vendor = await this.vendorsService.findOneOrFailById(vendorId);
    if (updateProfileDto.phone) {
      const vendorByPhone = await this.vendorsService.findOneByPhone(updateProfileDto.phone);
      if (vendorByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    return vendor;
  }

  // validate upload documents.
  async validateUploadDocuments(
    vendorId: number,
    uploadedFiles?: any,
  ): Promise<{
    vendor: Vendor;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const vendor: Vendor = await this.vendorsService.findOneOrFailById(vendorId, null, {
      attachments: true,
    });
    const documents: Document[] = await this.documentsService.findAll(vendor.serviceType);
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = Object.keys(uploadedFiles).findIndex((e: string) => e === document.id.toString());
      if (fileIndex === -1) {
        const oldAttachmentIndex = vendor.attachments.findIndex((e: Attachment) => e.documentId === document.id);
        if (document.required && (oldAttachmentIndex === -1 || (oldAttachmentIndex !== -1 && vendor.attachments[oldAttachmentIndex].status == AttachmentStatus.REQUIRED_FOR_UPLOAD)))
          throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file = Object.values(uploadedFiles)[fileIndex];
      if (document.type === DocumentType.IMAGE) {
        if (Object.values(ImageExtension).find((imageExtension: string) => imageExtension === file['mimetype'])) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an image of [${Object.values(ImageExtension).join(' , ')}].`);
        }
      } else {
        if (Object.values(FileExtension).find((fileExtension: string) => fileExtension === file['mimetype'])) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${Object.values(FileExtension).join(' , ')}].`);
        }
      }
    }
    return { createAttachmentDtoList, vendor };
  }
}
