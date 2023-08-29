import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { LocationVendor } from '../../../shared/entities/location-vendor.entity';

@Injectable()
export class LocationsVendorsService {
  constructor(
    @InjectRepository(LocationVendor)
    private readonly locationVendorRepository: Repository<LocationVendor>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<LocationVendor>): Promise<LocationVendor | null> {
    return this.locationVendorRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<LocationVendor>): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneById(id, relations);
    if (!locationVendor) {
      throw new BadRequestException(failureMessage || 'Location vendor not found.');
    }
    return locationVendor;
  }

  // find all by vendor id.
  findAllByVendorId(vendorId: number, relations?: FindOptionsRelations<LocationVendor>): Promise<LocationVendor[]> {
    return this.locationVendorRepository.find({
      where: { vendorId },
      relations,
    });
  }

  // remove one by id.
  async removeOneById(id: number): Promise<LocationVendor> {
    const locationVendor: LocationVendor = await this.findOneOrFailById(id);
    return this.locationVendorRepository.remove(locationVendor);
  }

  // remove one by instance.
  removeOneByInstance(locationVendor: LocationVendor): Promise<LocationVendor> {
    return this.locationVendorRepository.remove(locationVendor);
  }
}
