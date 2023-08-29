import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { LocationsService } from '../services/locations.service';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { LocationDto } from '../dtos/location.dto';
import { Public } from '../../../../core/metadata/public.metadata';
import { Location } from '../../entities/location.entity';

@Public()
@Controller('locations')
@Controller({ path: 'locations', version: '1' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Serialize(LocationDto, 'All locations.')
  @Get()
  findAll(@Query() findAllLocationsDto: FindAllLocationsDto): Promise<Location[]> {
    return this.locationsService.findAll(findAllLocationsDto);
  }
}
