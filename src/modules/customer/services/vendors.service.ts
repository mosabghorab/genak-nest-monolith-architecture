import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { LocationsService } from '../../shared/services/locations.service';
import { Vendor } from '../../shared/entities/vendor.entity';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';

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
  async findAll(
    findAllVendorsDto: FindAllVendorsDto,
    relations?: FindOptionsRelations<Vendor>,
  ) {
    if (findAllVendorsDto.governorateId) {
      const governorate = await this.locationsService.findOneById(
        findAllVendorsDto.governorateId,
      );
      if (!governorate) {
        throw new NotFoundException('Governorate not found.');
      }
    }
    const queryConditions: FindOptionsWhere<Vendor> = {
      serviceType: findAllVendorsDto.serviceType,
      status: VendorStatus.ACTIVE,
      available: true,
      governorateId: findAllVendorsDto.governorateId,
    };
    if (findAllVendorsDto.name) {
      queryConditions['name'] = ILike(`%${findAllVendorsDto.name}%`);
    }
    if (findAllVendorsDto.regionsIds) {
      queryConditions['locationsVendors'] = {
        locationId: In(findAllVendorsDto.regionsIds),
      };
    }
    return this.vendorRepository.find({
      where: queryConditions,
      relations,
    });
  }
}
