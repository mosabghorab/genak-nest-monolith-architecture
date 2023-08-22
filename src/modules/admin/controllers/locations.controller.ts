import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { LocationsService } from '../services/locations.service';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { LocationDto } from '../../shared/dtos/location.dto';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionsGroups.LOCATIONS)
@Controller('admin/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @AdminMustCanDo(PermissionsActions.CREATE)
  @Serialize(LocationDto, 'Location created successfully.')
  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(LocationDto, 'All locations.')
  @Get()
  findAll(@Query() findAllLocationsDto: FindAllLocationsDto) {
    return this.locationsService.findAll(findAllLocationsDto);
  }

  @AdminMustCanDo(PermissionsActions.VIEW)
  @Serialize(LocationDto, 'One location.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const location = await this.locationsService.findOneById(id);
    if (!location) {
      throw new NotFoundException('Location not found.');
    }
    return location;
  }

  @AdminMustCanDo(PermissionsActions.UPDATE)
  @Serialize(LocationDto, 'Location updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @AdminMustCanDo(PermissionsActions.DELETE)
  @Serialize(LocationDto, 'Location deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.locationsService.remove(id);
  }
}
