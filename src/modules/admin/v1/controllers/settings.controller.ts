import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { UserType } from '../../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { SettingsService } from '../services/settings.service';
import { CreateSettingDto } from '../dtos/settings/create-setting.dto';
import { SettingDto } from '../../../shared/v1/dtos/setting.dto';
import { UpdateSettingDto } from '../dtos/settings/update-setting.dto';
import { Setting } from '../../../shared/entities/setting.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.SETTINGS)
@Controller({ path: 'admin/settings', version: '1' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(SettingDto, 'Setting created successfully.')
  @Post()
  create(@Body() createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.settingsService.create(createSettingDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'All settings.')
  @Get()
  findAll(): Promise<Setting[]> {
    return this.settingsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'One setting.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Setting> {
    return this.settingsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(SettingDto, 'Setting updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSettingDto: UpdateSettingDto): Promise<Setting> {
    return this.settingsService.update(id, updateSettingDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(SettingDto, 'Setting deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Setting> {
    return this.settingsService.remove(id);
  }
}
