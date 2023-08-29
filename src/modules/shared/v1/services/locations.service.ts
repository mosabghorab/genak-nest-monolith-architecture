import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { Location } from '../../entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Location>): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id, active: true },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Location>): Promise<Location> {
    const location: Location = await this.findOneById(id, relations);
    if (!location) {
      throw new NotFoundException(failureMessage || 'Location not found.');
    }
    return location;
  }

  // find all.
  async findAll(findAllLocationsDto: FindAllLocationsDto): Promise<Location[]> {
    if (findAllLocationsDto.parentId) {
      await this.findOneOrFailById(findAllLocationsDto.parentId, 'Parent not found.');
    }
    return this.locationRepository.find({
      where: {
        parentId: findAllLocationsDto.parentId ? findAllLocationsDto.parentId : IsNull(),
        active: true,
      },
    });
  }
}
