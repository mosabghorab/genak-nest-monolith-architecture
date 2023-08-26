import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { SettingsService } from '../services/settings.service';
import { SettingDto } from '../dtos/setting.dto';
import { Public } from '../../../core/metadata/public.metadata';
import { FindAllSettingsDto } from '../dtos/find-all-settings.dto';

@Public()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Serialize(SettingDto, 'All settings.')
  @Get()
  findAll(@Query() findAllSettingsDto: FindAllSettingsDto) {
    return this.settingsService.findAll(findAllSettingsDto);
  }
}
