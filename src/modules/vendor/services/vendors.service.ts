import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Vendor } from '../../shared/entities/vendor.entity';
import { SignUpDto } from '../dtos/sign-up.dto';
import { LocationsService } from '../../shared/services/locations.service';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdateProfileUploadedFilesDto } from '../dtos/update-profile-uploaded-files.dto';
import { unlinkSync } from 'fs';
import { CreateAttachmentDto } from '../dtos/create-attachment.dto';
import { DocumentType } from '../../shared/enums/document-type.enum';
import { ImageExtension } from '../../shared/enums/image-extension.enum';
import { FileExtension } from '../../shared/enums/file-extension.enum';
import { Attachment } from '../../shared/entities/attachment.entity';
import { DocumentsService } from './documents.service';
import { AttachmentsService } from './attachments.service';
import { AttachmentStatus } from '../../shared/enums/attachment-status.enum';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Vendor>) {
    return this.vendorRepository.findOne({ where: { id }, relations });
  }

  // find one by phone.
  findOneByPhone(phone: string, relations?: FindOptionsRelations<Vendor>) {
    return this.vendorRepository.findOne({
      where: { phone },
      relations,
    });
  }

  // create.
  async create(
    signUpDto: SignUpDto,
    signUpUploadedFilesDto: SignUpUploadedFilesDto,
  ) {
    const vendor = await this.findOneByPhone(signUpDto.phone);
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate = await this.locationsService.findOneById(
      signUpDto.governorateId,
    );
    if (!governorate) {
      throw new NotFoundException('Governorate not found.');
    }
    if (signUpUploadedFilesDto.avatar) {
      await Helpers.saveFile(
        Constants.vendorsImagesPath,
        signUpUploadedFilesDto.avatar.name,
        signUpUploadedFilesDto.avatar,
      );
    }
    return await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: signUpUploadedFilesDto.avatar?.name,
        ...signUpDto,
      }),
    );
  }

  // update.
  async update(
    vendorId: number,
    updateProfileDto: UpdateProfileDto,
    updateProfileUploadedFilesDto: UpdateProfileUploadedFilesDto,
  ) {
    const vendor = await this.findOneById(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    if (updateProfileDto.phone) {
      const vendorByPhone = await this.findOneByPhone(updateProfileDto.phone);
      if (vendorByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateProfileUploadedFilesDto.avatar) {
      unlinkSync(Constants.vendorsImagesPath + vendor.avatar);
      await Helpers.saveFile(
        Constants.vendorsImagesPath,
        updateProfileUploadedFilesDto.avatar.name,
        updateProfileUploadedFilesDto.avatar,
      );
    }
    Object.assign(vendor, {
      avatar: updateProfileUploadedFilesDto.avatar?.name
        ? updateProfileUploadedFilesDto.avatar?.name
        : vendor.avatar,
      ...updateProfileDto,
    });
    return this.vendorRepository.save(vendor);
  }

  // upload documents.
  async uploadDocuments(vendorId: number, uploadedFiles?: any) {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const vendor = await this.findOneById(vendorId, {
      attachments: true,
    });
    const documents = await this.documentsService.findAll(vendor.serviceType);
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      const fileIndex = Object.keys(uploadedFiles).findIndex(
        (e) => e === document.id.toString(),
      );
      if (fileIndex === -1) {
        const oldAttachmentIndex = vendor.attachments.findIndex(
          (e) => e.documentId === document.id,
        );
        if (
          document.required &&
          (oldAttachmentIndex === -1 ||
            (oldAttachmentIndex !== -1 &&
              vendor.attachments[oldAttachmentIndex].status ==
                AttachmentStatus.REQUIRED_FOR_UPLOAD))
        )
          throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file = Object.values(uploadedFiles)[fileIndex];
      if (document.type == DocumentType.IMAGE) {
        if (
          Object.values(ImageExtension).find(
            (imageExtension) => imageExtension === file['mimetype'],
          )
        ) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(
            `${document.name} must be an image of [${Object.values(
              ImageExtension,
            ).join(' , ')}].`,
          );
        }
      } else {
        if (
          Object.values(FileExtension).find(
            (fileExtension) => fileExtension === file['mimetype'],
          )
        ) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            fileName: Helpers.generateUniqueFileName(file['name']),
            file: file,
          });
        } else {
          throw new BadRequestException(
            `${document.name} must be an file of [${Object.values(
              FileExtension,
            ).join(' , ')}].`,
          );
        }
      }
    }
    // save the attachments to the storage.
    for (const createAttachmentDto of createAttachmentDtoList) {
      // get all attachments for document id.
      const attachments =
        await this.attachmentsService.findByVendorIdAndDocumentId(
          vendorId,
          createAttachmentDto.documentId,
        );
      // check if there is an attachments for this document.
      if (attachments && attachments.length > 0) {
        // delete all attachments.
        await this.attachmentsService.removeByVendorIdAndDocumentId(
          createAttachmentDto.vendorId,
          createAttachmentDto.documentId,
        );
        for (const attachment of attachments) {
          unlinkSync(Constants.attachmentsPath + attachment.file);
          vendor.attachments = vendor.attachments.filter(
            (e) => e.id != attachment.id,
          );
        }
      }
      await Helpers.saveFile(
        Constants.attachmentsPath,
        createAttachmentDto.fileName,
        createAttachmentDto.file,
      );
    }
    const attachments: Attachment[] = createAttachmentDtoList.map(
      (e) =>
        <Attachment>{
          documentId: e.documentId,
          vendorId: e.vendorId,
          file: e.fileName,
        },
    );
    // re-save the vendor and return it.
    vendor.attachments = [...vendor.attachments, ...attachments];
    return await this.vendorRepository.save(vendor);
  }

  // remove.
  async remove(id: number) {
    const vendor = await this.findOneById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    return this.vendorRepository.remove(vendor);
  }
}
