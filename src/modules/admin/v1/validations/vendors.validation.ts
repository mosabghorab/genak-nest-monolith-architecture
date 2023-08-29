import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { VendorsService } from '../services/vendors.service';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { DocumentsService } from '../services/documents.service';
import { Document } from '../../../shared/entities/document.entity';
import { DocumentType } from '../../../shared/enums/document-type.enum';
import { ImageExtension } from '../../../shared/enums/image-extension.enum';
import { Helpers } from '../../../../core/helpers';
import { FileExtension } from '../../../shared/enums/file-extension.enum';
import { CreateVendorDto } from '../dtos/vendors/create-vendor.dto';
import { Location } from '../../../shared/entities/location.entity';
import { FindAllDocumentsDto } from '../dtos/documents/find-all-documents.dto';
import { CreateAttachmentDto } from '../dtos/attachments/create-attachment.dto';
import { UpdateVendorDto } from '../dtos/vendors/update-vendor.dto';
import { AttachmentStatus } from '../../../shared/enums/attachment-status.enum';
import { LocationsService } from '../services/locations.service';

@Injectable()
export class VendorsValidation {
  constructor(
    @Inject(forwardRef(() => VendorsService))
    private readonly vendorsService: VendorsService,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
  ) {}

  // validate creation.
  async validateCreation(createVendorDto: CreateVendorDto): Promise<Location> {
    const vendor: Vendor = await this.vendorsService.findOneByPhone(createVendorDto.phone);
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsService.findOneOrFailById(createVendorDto.governorateId, 'Governorate not found.');
    for (const regionId of createVendorDto.regionsIds) {
      const region: Location = await this.locationsService.findOneOrFailById(regionId, 'Region not found.');
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return governorate;
  }

  // validate creation upload documents.
  async validateCreationUploadDocuments(
    createVendorDto: CreateVendorDto,
    uploadedFiles?: any,
  ): Promise<{
    avatar?: any;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    const avatar = uploadedFiles?.avatar;
    if (avatar) {
      if (!Object.values(ImageExtension).find((imageExtension) => imageExtension === avatar['mimetype'])) {
        throw new BadRequestException(`avatar must be an image of [${Object.values(ImageExtension).join(' , ')}].`);
      }
      avatar.name = Helpers.generateUniqueFileName(avatar.name);
      delete uploadedFiles.avatar;
    }
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const documents: Document[] = await this.documentsService.findAll(<FindAllDocumentsDto>{
      serviceType: createVendorDto.serviceType,
      active: true,
    });
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = Object.keys(uploadedFiles).findIndex((e: string) => e === document.id.toString());
      if (fileIndex === -1) {
        if (document.required) throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file = Object.values(uploadedFiles)[fileIndex];
      if (document.type === DocumentType.IMAGE) {
        if (Object.values(ImageExtension).find((imageExtension: string) => imageExtension === file['mimetype'])) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: 0,
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
            vendorId: 0,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${Object.values(FileExtension).join(' , ')}].`);
        }
      }
    }
    return { createAttachmentDtoList, avatar };
  }

  // validate update.
  async validateUpdate(vendorId: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor: Vendor = await this.vendorsService.findOneOrFailById(vendorId, null, {
      attachments: true,
      locationsVendors: true,
    });
    if (updateVendorDto.phone) {
      const vendor: Vendor = await this.vendorsService.findOneByPhone(updateVendorDto.phone);
      if (vendor) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateVendorDto.governorateId) {
      const governorate: Location = await this.locationsService.findOneOrFailById(updateVendorDto.governorateId);
      for (const regionId of updateVendorDto.regionsIds) {
        const region: Location = await this.locationsService.findOneOrFailById(regionId);
        if (region.parentId !== governorate.id) {
          throw new BadRequestException('The provided region is not a child for the provided governorate.');
        }
      }
    }
    return vendor;
  }

  // validate update upload documents.
  async validateUpdateUploadDocuments(
    vendor: Vendor,
    uploadedFiles?: any,
  ): Promise<{
    avatar?: any;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    const avatar = uploadedFiles?.avatar;
    if (avatar) {
      if (!Object.values(ImageExtension).find((imageExtension) => imageExtension === avatar['mimetype'])) {
        throw new BadRequestException(`avatar must be an image of [${Object.values(ImageExtension).join(' , ')}].`);
      }
      avatar.name = Helpers.generateUniqueFileName(avatar.name);
      delete uploadedFiles.avatar;
    }
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const documents: Document[] = await this.documentsService.findAll(<FindAllDocumentsDto>{
      serviceType: vendor.serviceType,
      active: true,
    });
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = Object.keys(uploadedFiles).findIndex((e: string) => e === document.id.toString());
      if (fileIndex === -1) {
        const oldAttachmentIndex = vendor.attachments.findIndex((e) => e.documentId === document.id);
        if (document.required && (oldAttachmentIndex === -1 || (oldAttachmentIndex !== -1 && vendor.attachments[oldAttachmentIndex].status == AttachmentStatus.REQUIRED_FOR_UPLOAD)))
          throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file = Object.values(uploadedFiles)[fileIndex];
      if (document.type === DocumentType.IMAGE) {
        if (Object.values(ImageExtension).find((imageExtension: string) => imageExtension === file['mimetype'])) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendor.id,
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
            vendorId: vendor.id,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${Object.values(FileExtension).join(' , ')}].`);
        }
      }
    }
    return { createAttachmentDtoList, avatar };
  }
}
