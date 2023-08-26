import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { UserType } from '../../shared/enums/user-type.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { SettingsService } from '../services/settings.service';
import { CreateSettingDto } from '../dtos/create-setting.dto';
import { SettingDto } from '../../shared/dtos/setting.dto';
import { UpdateSettingDto } from '../dtos/update-setting.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.SETTINGS)
@Controller('admin/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(SettingDto, 'Setting created successfully.')
  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'All settings.')
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'One setting.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const setting = await this.settingsService.findOneById(id);
    if (!setting) {
      throw new NotFoundException('Setting not found.');
    }
    return setting;
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(SettingDto, 'Setting updated successfully.')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(SettingDto, 'Setting deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.settingsService.remove(id);
  }
}
