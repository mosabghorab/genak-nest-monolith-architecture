import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Location } from '../../shared/entities/location.entity';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';

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
      },
      relations,
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
}
