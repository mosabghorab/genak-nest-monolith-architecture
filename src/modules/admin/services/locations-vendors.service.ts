import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { LocationVendor } from '../../shared/entities/location-vendor.entity';

@Injectable()
export class LocationsVendorsService {
  constructor(
    @InjectRepository(LocationVendor)
    private readonly locationVendorRepository: Repository<LocationVendor>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<LocationVendor>) {
    return this.locationVendorRepository.findOne({ where: { id }, relations });
  }

  // remove.
  async remove(id: number) {
    const locationVendor = await this.findOneById(id);
    if (!locationVendor) {
      throw new NotFoundException('Location vendor not found.');
    }
    return this.locationVendorRepository.remove(locationVendor);
  }
}
