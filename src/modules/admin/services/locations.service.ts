import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Location } from '../../shared/entities/location.entity';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Location>) {
    return this.locationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find all.
  async findAll(findAllLocationsDto: FindAllLocationsDto) {
    if (findAllLocationsDto.parentId) {
      const parent = await this.findOneById(findAllLocationsDto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent not found.');
      }
    }
    return this.locationRepository.find({
      where: {
        parentId: findAllLocationsDto.parentId
          ? findAllLocationsDto.parentId
          : IsNull(),
      },
    });
  }

  // create.
  async create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(
      await this.locationRepository.create(createLocationDto),
    );
  }

  // update.
  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOneById(id);
    if (!location) {
      throw new NotFoundException('Location not found.');
    }
    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  // remove.
  async remove(id: number) {
    const location = await this.findOneById(id);
    if (!location) {
      throw new NotFoundException('Location not found.');
    }
    return this.locationRepository.remove(location);
  }

  // find governorates with vendors , customers and orders count.
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(
    serviceType: ServiceType,
  ) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin(
        'location.vendors',
        'vendor',
        'vendor.serviceType = :serviceType',
        { serviceType },
      )
      .leftJoin(
        'customer.orders',
        'order',
        'order.serviceType = :serviceType',
        { serviceType },
      )
      .where('location.parentId is NULL')
      .select([
        'location.*',
        'COUNT(DISTINCT vendor.id) AS vendorsCount',
        'COUNT(DISTINCT customer.id) AS customersCount',
        'COUNT(DISTINCT order.id) AS ordersCount',
      ])
      .groupBy('location.id')
      .getRawMany();
  }

  // find governorates with orders count.
  findGovernoratesWithOrdersCount(serviceType: ServiceType) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin(
        'customer.orders',
        'order',
        'order.serviceType = :serviceType',
        { serviceType },
      )
      .where('location.parentId is NULL')
      .select(['location.*', 'COUNT(DISTINCT order.id) AS ordersCount'])
      .groupBy('location.id')
      .getRawMany();
  }

  // find regions with orders count.
  findRegionsWithOrdersCount(serviceType: ServiceType) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByRegion', 'customer')
      .leftJoin(
        'customer.orders',
        'order',
        'order.serviceType = :serviceType',
        { serviceType },
      )
      .where('location.parentId is NOT NULL')
      .select(['location.*', 'COUNT(DISTINCT order.id) AS ordersCount'])
      .groupBy('location.id')
      .getRawMany();
  }

  // find governorates with vendors count.
  findGovernoratesWithVendorsCount(serviceType: ServiceType) {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoin(
        'location.vendors',
        'vendor',
        'vendor.serviceType = :serviceType',
        { serviceType },
      )
      .where('location.parentId is NULL')
      .select([
        'location.*',
        `COUNT(DISTINCT CASE WHEN vendor.status = :documentsRequiredStatus THEN vendor.id ELSE NULL END) AS documentsRequiredVendorsCount`,
        `COUNT(DISTINCT CASE WHEN vendor.status = :pendingStatus THEN vendor.id ELSE NULL END) AS pendingVendorsCount`,
        `COUNT(DISTINCT CASE WHEN vendor.status = :activeStatus THEN vendor.id ELSE NULL END) AS activeVendorsCount`,
      ])
      .groupBy('location.id')
      .setParameter('documentsRequiredStatus', VendorStatus.DOCUMENTS_REQUIRED)
      .setParameter('pendingStatus', VendorStatus.PENDING)
      .setParameter('activeStatus', VendorStatus.ACTIVE)
      .getRawMany();
  }

  // find governorates with customers count.
  findGovernoratesWithCustomersCount() {
    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .where('location.parentId is NULL')
      .select(['location.*', `COUNT(DISTINCT customer.id) AS customersCount`])
      .groupBy('location.id')
      .getRawMany();
  }
}
