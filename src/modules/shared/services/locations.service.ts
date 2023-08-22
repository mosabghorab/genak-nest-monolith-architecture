import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Location>) {
    return this.locationRepository.findOne({
      where: { id, active: true },
      relations,
    });
  }

  // find all.
  async findAll(
    findAllLocationsDto: FindAllLocationsDto,
    relations?: FindOptionsRelations<Location>,
  ) {
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
        active: true,
      },
      relations,
    });
  }
}
