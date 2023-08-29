import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { SignUpDto } from '../dtos/sign-up.dto';
import { LocationsService } from '../../../shared/v1/services/locations.service';
import { SignUpUploadedFilesDto } from '../dtos/sign-up-uploaded-files.dto';
import { Helpers } from '../../../../core/helpers';
import { Constants } from '../../../../core/constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdateProfileUploadedFilesDto } from '../dtos/update-profile-uploaded-files.dto';
import { unlinkSync } from 'fs';
import { Attachment } from '../../../shared/entities/attachment.entity';
import { DocumentsService } from './documents.service';
import { AttachmentsService } from './attachments.service';
import { VendorsValidation } from '../validations/vendors.validation';
import { CreateAttachmentDto } from '../dtos/create-attachment.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
    private readonly attachmentsService: AttachmentsService,
    @Inject(forwardRef(() => VendorsValidation))
    private readonly vendorsValidation: VendorsValidation,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(id, relations);
    if (!vendor) {
      throw new NotFoundException(failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(phone: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone },
      relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(phone: string, failureMessage?: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneByPhone(phone, relations);
    if (!vendor) {
      throw new NotFoundException(failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // create.
  async create(signUpDto: SignUpDto, signUpUploadedFilesDto: SignUpUploadedFilesDto): Promise<Vendor> {
    await this.vendorsValidation.validateCreation(signUpDto);
    if (signUpUploadedFilesDto.avatar) {
      await Helpers.saveFile(Constants.vendorsImagesPath, signUpUploadedFilesDto.avatar.name, signUpUploadedFilesDto.avatar);
    }
    return await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: signUpUploadedFilesDto.avatar?.name,
        ...signUpDto,
      }),
    );
  }

  // update.
  async update(vendorId: number, updateProfileDto: UpdateProfileDto, updateProfileUploadedFilesDto: UpdateProfileUploadedFilesDto): Promise<Vendor> {
    const vendor: Vendor = await this.vendorsValidation.validateUpdate(vendorId, updateProfileDto);
    if (updateProfileUploadedFilesDto.avatar) {
      unlinkSync(Constants.vendorsImagesPath + vendor.avatar);
      await Helpers.saveFile(Constants.vendorsImagesPath, updateProfileUploadedFilesDto.avatar.name, updateProfileUploadedFilesDto.avatar);
      vendor.avatar = updateProfileUploadedFilesDto.avatar.name;
    }
    Object.assign(vendor, updateProfileDto);
    return this.vendorRepository.save(vendor);
  }

  // upload documents.
  async uploadDocuments(vendorId: number, uploadedFiles?: any): Promise<Vendor> {
    const {
      createAttachmentDtoList,
      vendor,
    }: {
      vendor: Vendor;
      createAttachmentDtoList: CreateAttachmentDto[];
    } = await this.vendorsValidation.validateUploadDocuments(vendorId, uploadedFiles);
    for (const createAttachmentDto of createAttachmentDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentsService.findByVendorIdAndDocumentId(vendorId, createAttachmentDto.documentId);
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsService.removeOneByInstance(oldAttachment);
          vendor.attachments = vendor.attachments.filter((e: Attachment) => e.id !== oldAttachment.id);
        }
      }
      await Helpers.saveFile(Constants.attachmentsPath, createAttachmentDto.fileName, createAttachmentDto.file);
    }
    const attachments: Attachment[] = createAttachmentDtoList.map(
      (e: CreateAttachmentDto) =>
        <Attachment>{
          documentId: e.documentId,
          vendorId: e.vendorId,
          file: e.fileName,
        },
    );
    vendor.attachments = [...vendor.attachments, ...attachments];
    return await this.vendorRepository.save(vendor);
  }

  // remove.
  async remove(id: number): Promise<Vendor> {
    const vendor: Vendor = await this.findOneOrFailById(id);
    return this.vendorRepository.remove(vendor);
  }
}
