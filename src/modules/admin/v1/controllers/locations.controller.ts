import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { LocationsService } from '../services/locations.service';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { LocationDto } from '../../../shared/v1/dtos/location.dto';
import { CreateLocationDto } from '../dtos/locations/create-location.dto';
import { FindAllLocationsDto } from '../dtos/locations/find-all-locations.dto';
import { UpdateLocationDto } from '../dtos/locations/update-location.dto';
import { Location } from '../../../shared/entities/location.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.LOCATIONS)
@Controller({ path: 'admin/locations', version: '1' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(LocationDto, 'Location created successfully.')
  @Post()
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(createLocationDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationDto, 'All locations.')
  @Get()
  findAll(@Query() findAllLocationsDto: FindAllLocationsDto): Promise<Location[]> {
    return this.locationsService.findAll(findAllLocationsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationDto, 'One location.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Location> {
    return this.locationsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(LocationDto, 'Location updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLocationDto: UpdateLocationDto): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(LocationDto, 'Location deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Location> {
    return this.locationsService.remove(id);
  }
}
