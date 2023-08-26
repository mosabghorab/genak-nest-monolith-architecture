import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { GeneralStatisticsService } from '../services/general-statistics.service';
import { GeneralStatisticsDto } from '../dtos/general-statistics.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { FindGeneralStatisticsDto } from '../dtos/find-general-statistics.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.GENERAL_STATISTICS)
@Controller('admin/general-statistics')
export class GeneralStatisticsController {
  constructor(
    private readonly generalStatisticsService: GeneralStatisticsService,
  ) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(GeneralStatisticsDto, 'General statistics.')
  @Get()
  findAll(@Query() findGeneralStatisticsDto: FindGeneralStatisticsDto) {
    return this.generalStatisticsService.findAll(findGeneralStatisticsDto);
  }
}
