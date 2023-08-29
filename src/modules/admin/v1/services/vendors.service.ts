import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { Helpers } from '../../../../core/helpers/helpers';
import { Constants } from '../../../../core/constants';
import { LocationsService } from './locations.service';
import { CreateVendorDto } from '../dtos/vendors/create-vendor.dto';
import { CreateAttachmentDto } from '../../../vendor/v1/dtos/create-attachment.dto';
import { Attachment } from '../../../shared/entities/attachment.entity';
import { DocumentsService } from './documents.service';
import { FindAllVendorsDto } from '../dtos/vendors/find-all-vendors.dto';
import { AttachmentsService } from './attachments.service';
import { VendorStatus } from '../../../vendor/enums/vendor-status.enum';
import { UpdateVendorDto } from '../dtos/vendors/update-vendor.dto';
import { unlinkSync } from 'fs';
import { LocationVendor } from '../../../shared/entities/location-vendor.entity';
import { LocationsVendorsService } from './locations-vendors.service';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { VendorsValidation } from '../validations/vendors.validation';
import { Location } from '../../../shared/entities/location.entity';
import { OrderByType } from '../../../shared/enums/order-by-type.enum';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsService: LocationsService,
    private readonly documentsService: DocumentsService,
    private readonly attachmentsService: AttachmentsService,
    private readonly locationsVendorsService: LocationsVendorsService,
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

  // find all.
  async findAll(findAllVendorsDto: FindAllVendorsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Vendor[];
    currentPage: number;
  }> {
    const offset: number = (findAllVendorsDto.page - 1) * findAllVendorsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllVendorsDto.dateFilterOption) {
      if (findAllVendorsDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllVendorsDto.startDate,
          endDate: findAllVendorsDto.endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllVendorsDto.dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<Vendor> = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoin('vendor.orders', 'order')
      .addSelect('COUNT(order.id)', ' ordersCount');
    if (findAllVendorsDto.regionsIds) {
      queryBuilder.innerJoin('vendor.locationsVendors', 'locationVendor', 'locationVendor.locationId IN (:...regionsIds)', { regionsIds: findAllVendorsDto.regionsIds });
    }
    queryBuilder
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
      queryBuilder.andWhere('vendor.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    queryBuilder.groupBy('vendor.id').orderBy('ordersCount', findAllVendorsDto.orderByType).skip(offset).take(findAllVendorsDto.limit);
    const { entities, raw }: { entities: Vendor[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i].locationsVendors = await this.locationsVendorsService.findAllByVendorId(entities[i].id, {
        location: true,
      });
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return {
      perPage: findAllVendorsDto.limit,
      currentPage: findAllVendorsDto.page,
      lastPage: Math.ceil(count / findAllVendorsDto.limit),
      total: count,
      data: entities,
    };
  }

  // create.
  async create(createVendorDto: CreateVendorDto, uploadedFiles?: any): Promise<Vendor> {
    const governorate: Location = await this.vendorsValidation.validateCreation(createVendorDto);
    const {
      createAttachmentDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentDtoList: CreateAttachmentDto[];
    } = await this.vendorsValidation.validateCreationUploadDocuments(createVendorDto, uploadedFiles);
    if (avatar) {
      await Helpers.saveFile(Constants.vendorsImagesPath, avatar.name, avatar);
    }
    const savedVendor: Vendor = await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatar?.name,
        status: VendorStatus.PENDING,
        ...createVendorDto,
      }),
    );
    const locationsVendors: LocationVendor[] = createVendorDto.regionsIds.map(
      (value: number) =>
        <LocationVendor>{
          vendorId: savedVendor.id,
          locationId: value,
        },
    );
    createAttachmentDtoList.forEach((value: CreateAttachmentDto) => {
      value.vendorId = savedVendor.id;
    });
    for (const createAttachmentDto of createAttachmentDtoList) {
      await Helpers.saveFile(Constants.attachmentsPath, createAttachmentDto.fileName, createAttachmentDto.file);
    }
    const attachments: Attachment[] = createAttachmentDtoList.map(
      (e) =>
        <Attachment>{
          documentId: e.documentId,
          vendorId: e.vendorId,
          file: e.fileName,
        },
    );
    savedVendor.locationsVendors = locationsVendors;
    savedVendor.attachments = attachments;
    savedVendor.governorate = governorate;
    return await this.vendorRepository.save(savedVendor);
  }

  // update.
  async update(vendorId: number, updateVendorDto: UpdateVendorDto, uploadedFiles?: any): Promise<Vendor> {
    const vendor: Vendor = await this.vendorsValidation.validateUpdate(vendorId, updateVendorDto);
    const {
      createAttachmentDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentDtoList: CreateAttachmentDto[];
    } = await this.vendorsValidation.validateUpdateUploadDocuments(vendor, uploadedFiles);
    if (avatar) {
      unlinkSync(Constants.vendorsImagesPath + vendor.avatar);
      await Helpers.saveFile(Constants.vendorsImagesPath, avatar.name, avatar);
      vendor.avatar = avatar.name;
    }
    Object.assign(vendor, updateVendorDto);
    const savedVendor: Vendor = await this.vendorRepository.save(vendor);
    if (updateVendorDto.regionsIds) {
      for (const locationVendor of savedVendor.locationsVendors) {
        await this.locationsVendorsService.removeOneByInstance(locationVendor);
      }
      // prepare regions.
      savedVendor.locationsVendors = updateVendorDto.regionsIds.map(
        (value: number) =>
          <LocationVendor>{
            vendorId: savedVendor.id,
            locationId: value,
          },
      );
    }
    for (const createAttachmentDto of createAttachmentDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentsService.findByVendorIdAndDocumentId(savedVendor.id, createAttachmentDto.documentId);
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsService.removeOneByInstance(oldAttachment);
          savedVendor.attachments = savedVendor.attachments.filter((e) => e.id != oldAttachment.id);
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
    savedVendor.attachments = [...savedVendor.attachments, ...attachments];
    return this.vendorRepository.save(savedVendor);
  }

  // remove.
  async remove(id: number): Promise<Vendor> {
    const vendor: Vendor = await this.findOneOrFailById(id);
    return this.vendorRepository.remove(vendor);
  }

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus): Promise<number> {
    return this.vendorRepository.count({
      where: { serviceType, status },
    });
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { serviceType, status: VendorStatus.PENDING },
      relations,
      take: count,
    });
  }

  // find best sellers with orders count.
  async findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterOption: DateFilterOption, startDate: Date, endDate: Date): Promise<Vendor[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
    }
    const {
      entities,
      raw,
    }: {
      entities: Vendor[];
      raw: any[];
    } = await this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoin('vendor.orders', 'order', 'order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('vendor.serviceType = :serviceType', { serviceType })
      .groupBy('vendor.id')
      .having('ordersCount > 0')
      .orderBy('ordersCount', OrderByType.DESC)
      .limit(5)
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }
}
