import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { LocationsService } from '../../shared/services/locations.service';
import { Vendor } from '../../shared/entities/vendor.entity';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsService: LocationsService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Vendor>) {
    return this.vendorRepository.findOne({ where: { id }, relations });
  }

  // find all.
  async findAll(findAllVendorsDto: FindAllVendorsDto) {
    if (findAllVendorsDto.governorateId) {
      const governorate = await this.locationsService.findOneById(
        findAllVendorsDto.governorateId,
      );
      if (!governorate) {
        throw new NotFoundException('Governorate not found.');
      }
      for (const regionId of findAllVendorsDto.regionsIds) {
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
    const queryBuilder = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoin('vendor.orders', 'order')
      .leftJoin('vendor.reviews', 'review', 'review.reviewedBy = :reviewedBy', {
        reviewedBy: ClientUserType.CUSTOMER,
      })
      .addSelect([
        'AVG(order.averageTimeMinutes) AS averageTimeMinutes',
        'AVG(review.rate) AS averageRate',
        'COUNT(DISTINCT review.id) AS reviewsCount',
      ]);
    if (findAllVendorsDto.regionsIds) {
      queryBuilder.innerJoin(
        'vendor.locationsVendors',
        'locationVendor',
        'locationVendor.locationId IN (:...regionsIds)',
        {
          regionsIds: findAllVendorsDto.regionsIds,
        },
      );
    }
    queryBuilder
      .where('vendor.serviceType = :serviceType', {
        serviceType: findAllVendorsDto.serviceType,
      })
      .andWhere('vendor.status = :status', {
        status: VendorStatus.ACTIVE,
      })
      .andWhere('vendor.available = :available', {
        available: true,
      });
    if (findAllVendorsDto.governorateId) {
      queryBuilder.andWhere('vendor.governorateId = :governorateId', {
        governorateId: findAllVendorsDto.governorateId,
      });
    }
    if (findAllVendorsDto.name) {
      queryBuilder.andWhere('vendor.name LIKE :name', {
        name: `%${findAllVendorsDto.name}%`,
      });
    }
    queryBuilder.groupBy('vendor.id');
    const result = await queryBuilder.getRawAndEntities();
    const raw = result.raw;
    const vendors = result.entities;
    for (let i = 0; i < vendors.length; i++) {
      vendors[i]['averageTimeMinutes'] =
        Math.floor(raw[i]['averageTimeMinutes']) || 0;
      vendors[i]['averageRate'] = Math.ceil(raw[i]['averageRate']) || 0;
      vendors[i]['reviewsCount'] = Math.ceil(raw[i]['reviewsCount']);
    }
    return vendors;
  }
}
