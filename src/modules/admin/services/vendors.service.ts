import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Vendor } from '../../shared/entities/vendor.entity';
import { Helpers } from '../../../core/helpers';
import { Constants } from '../../../core/constants';
import { LocationsService } from './locations.service';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { CreateAttachmentDto } from '../../vendor/dtos/create-attachment.dto';
import { DocumentType } from '../../shared/enums/document-type.enum';
import { ImageExtension } from '../../shared/enums/image-extension.enum';
import { FileExtension } from '../../shared/enums/file-extension.enum';
import { Attachment } from '../../shared/entities/attachment.entity';
import { DocumentsService } from './documents.service';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { AttachmentsService } from './attachments.service';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { unlinkSync } from 'fs';
import { LocationVendor } from '../../shared/entities/location-vendor.entity';
import { LocationsVendorsService } from './locations-vendors.service';
import { AttachmentStatus } from '../../shared/enums/attachment-status.enum';
import { FindAllDocumentsDto } from '../dtos/find-all-documents.dto';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { DateFilterOption } from '../enums/date-filter-options.enum';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
    private readonly attachmentsService: AttachmentsService,
    private readonly locationsVendorsService: LocationsVendorsService,
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

  // find all.
  async findAll(findAllVendorsDto: FindAllVendorsDto) {
    const offset = (findAllVendorsDto.page - 1) * findAllVendorsDto.limit;
    const queryBuilder = this.vendorRepository.createQueryBuilder('vendor');
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllVendorsDto.dateFilterOption) {
      if (findAllVendorsDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllVendorsDto.startDate,
          endDate: findAllVendorsDto.endDate,
        };
      } else {
        dateRange = Helpers.getDateRangeForFilterOption(
          findAllVendorsDto.dateFilterOption,
        );
      }
    }
    queryBuilder
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoinAndSelect('vendor.orders', 'order')
      .addSelect('COUNT(DISTINCT order.id) AS ordersCount');
    if (findAllVendorsDto.regionsIds) {
      queryBuilder.innerJoinAndSelect(
        'vendor.locationsVendors',
        'locationVendor',
      );
    } else {
      queryBuilder.leftJoinAndSelect(
        'vendor.locationsVendors',
        'locationVendor',
      );
    }
    queryBuilder
      .leftJoinAndSelect('locationVendor.location', 'location')
      .where('vendor.serviceType = :serviceType', {
        serviceType: findAllVendorsDto.serviceType,
      })
      .andWhere('vendor.status IN (:...statuses)', {
        statuses: findAllVendorsDto.statuses,
      });
    if (findAllVendorsDto.governorateId) {
      queryBuilder.andWhere('vendor.governorateId = :governorateId', {
        governorateId: findAllVendorsDto.governorateId,
      });
    }
    if (findAllVendorsDto.dateFilterOption) {
      queryBuilder.andWhere(
        'vendor.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      );
    }
    queryBuilder
      .groupBy('vendor.id')
      .addGroupBy('locationVendor.id')
      .orderBy('ordersCount', findAllVendorsDto.orderByType)
      .skip(offset)
      .take(findAllVendorsDto.limit);
    const [vendors, count] = await queryBuilder.getManyAndCount();
    return {
      perPage: findAllVendorsDto.limit,
      currentPage: findAllVendorsDto.page,
      lastPage: Math.ceil(count / findAllVendorsDto.limit),
      total: count,
      data: vendors,
    };
  }

  // create.
  async create(createVendorDto: CreateVendorDto, uploadedFiles?: any) {
    // check and validate the vendor main information.
    const vendor = await this.findOneByPhone(createVendorDto.phone);
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate = await this.locationsService.findOneById(
      createVendorDto.governorateId,
    );
    if (!governorate) {
      throw new NotFoundException('Governorate not found.');
    }
    for (const regionId of createVendorDto.regionsIds) {
      const region = await this.locationsService.findOneById(regionId);
      if (!region) {
        throw new NotFoundException('Region not found.');
      }
      if (region.parentId !== governorate.id) {
        throw new BadRequestException(
          'The provided region is not for the provided governorate.',
        );
      }
    }
    // validate and save the avatar to an object then delete it from uploaded files.
    const avatar = uploadedFiles?.avatar;
    if (avatar) {
      if (
        !Object.values(ImageExtension).find(
          (imageExtension) => imageExtension === avatar['mimetype'],
        )
      ) {
        throw new BadRequestException(
          `avatar must be an image of [${Object.values(ImageExtension).join(
            ' , ',
          )}].`,
        );
      }
      avatar.name = Helpers.generateUniqueFileName(avatar.name);
      delete uploadedFiles?.avatar;
    }
    // check all the uploaded documents are validated and ready to be saved with preparing of the createAttachmentDtoList.
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const documents = await this.documentsService.findAll(<FindAllDocumentsDto>{
      serviceType: createVendorDto.serviceType,
      active: true,
    });
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
        if (document.required)
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
            vendorId: 0,
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
            vendorId: 0,
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
    if (avatar) {
      // save the avatar to storage.
      await Helpers.saveFile(Constants.vendorsImagesPath, avatar.name, avatar);
    }
    // save the vendor to database.
    const savedVendor = await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatar?.name,
        status: VendorStatus.PENDING,
        ...createVendorDto,
      }),
    );
    // prepare regions.
    const locationsVendors: LocationVendor[] = createVendorDto.regionsIds.map(
      (value) =>
        <LocationVendor>{
          vendorId: savedVendor.id,
          locationId: value,
        },
    );
    // add the vendor id to the prepared createAttachmentDtoList.
    createAttachmentDtoList.forEach((value) => {
      value.vendorId = savedVendor.id;
    });
    // save the attachments to the storage.
    for (const createAttachmentDto of createAttachmentDtoList) {
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
    savedVendor.locationsVendors = locationsVendors;
    savedVendor.attachments = attachments;
    savedVendor.governorate = governorate;
    return await this.vendorRepository.save(savedVendor);
  }

  // update.
  async update(
    vendorId: number,
    updateVendorDto: UpdateVendorDto,
    uploadedFiles?: any,
  ) {
    const vendor = await this.findOneById(vendorId, {
      attachments: true,
      locationsVendors: true,
    });
    // check and validate the vendor main information.
    if (updateVendorDto.phone) {
      const vendor = await this.findOneByPhone(updateVendorDto.phone);
      if (vendor) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateVendorDto.governorateId) {
      const governorate = await this.locationsService.findOneById(
        updateVendorDto.governorateId,
      );
      if (!governorate) {
        throw new NotFoundException('Governorate not found.');
      }
      for (const regionId of updateVendorDto.regionsIds) {
        const region = await this.locationsService.findOneById(regionId);
        if (!region) {
          throw new NotFoundException('Region not found.');
        }
        if (region.parentId !== governorate.id) {
          throw new BadRequestException(
            'The provided region is not for the provided governorate.',
          );
        }
      }
    }
    // validate and save the avatar to an object then delete it from uploaded files.
    const avatar = uploadedFiles?.avatar;
    if (avatar) {
      if (
        !Object.values(ImageExtension).find(
          (imageExtension) => imageExtension === avatar['mimetype'],
        )
      ) {
        throw new BadRequestException(
          `avatar must be an image of [${Object.values(ImageExtension).join(
            ' , ',
          )}].`,
        );
      }
      avatar.name = Helpers.generateUniqueFileName(avatar.name);
      delete uploadedFiles?.avatar;
    }
    // check all the uploaded documents are validated and ready to be saved with preparing of the createAttachmentDtoList.
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    if (uploadedFiles && Object.keys(uploadedFiles).length > 0) {
      const documents = await this.documentsService.findAll(<
        FindAllDocumentsDto
      >{
        serviceType: vendor.serviceType,
        active: true,
      });
      if (!documents || documents.length === 0) {
        throw new BadRequestException('There is no documents to upload.');
      }
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
              vendorId: vendor.id,
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
              vendorId: vendor.id,
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
    }
    if (avatar) {
      // delete the old avatar and save the new one to storage.
      unlinkSync(Constants.vendorsImagesPath + vendor.avatar);
      await Helpers.saveFile(Constants.vendorsImagesPath, avatar.name, avatar);
      vendor.avatar = avatar.name;
    }
    // update and save the vendor to database.
    Object.assign(vendor, updateVendorDto);
    const savedVendor = await this.vendorRepository.save(vendor);
    if (updateVendorDto.regionsIds) {
      // delete old regions.
      for (const locationVendor of savedVendor.locationsVendors) {
        await this.locationsVendorsService.remove(locationVendor.id);
      }
      // prepare regions.
      savedVendor.locationsVendors = updateVendorDto.regionsIds.map(
        (value) =>
          <LocationVendor>{
            vendorId: savedVendor.id,
            locationId: value,
          },
      );
    }
    // save the attachments to the storage.
    for (const createAttachmentDto of createAttachmentDtoList) {
      // get all attachments for document id.
      const attachments =
        await this.attachmentsService.findByVendorIdAndDocumentId(
          savedVendor.id,
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
          savedVendor.attachments = savedVendor.attachments.filter(
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
    savedVendor.attachments = [...savedVendor.attachments, ...attachments];
    return this.vendorRepository.save(savedVendor);
  }

  // remove.
  async remove(id: number) {
    const vendor = await this.findOneById(id);
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    return this.vendorRepository.remove(vendor);
  }

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus) {
    return this.vendorRepository.count({
      where: { serviceType, status },
    });
  }

  // find latest.
  findLatest(
    count: number,
    serviceType: ServiceType,
    relations?: FindOptionsRelations<Vendor>,
  ) {
    return this.vendorRepository.find({
      where: { serviceType, status: VendorStatus.PENDING },
      relations,
      take: count,
    });
  }

  // find vendors best seller with orders count.
  async findVendorsBestSellerWithOrdersCount(serviceType: ServiceType) {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoin('vendor.orders', 'order', 'order.serviceType = :serviceType', {
        serviceType,
      })
      .where('vendor.serviceType = :serviceType', { serviceType })
      .select(['vendor.*', 'COUNT(DISTINCT order.id) AS ordersCount'])
      .groupBy('vendor.id')
      .orderBy('ordersCount', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
