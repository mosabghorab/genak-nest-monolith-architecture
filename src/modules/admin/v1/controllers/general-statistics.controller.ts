import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { GeneralStatisticsService } from '../services/general-statistics.service';
import { GeneralStatisticsDto } from '../dtos/general-statistics/general-statistics.dto';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { FindGeneralStatisticsDto } from '../dtos/general-statistics/find-general-statistics.dto';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { Order } from '../../../shared/entities/order.entity';
import { Location } from '../../../shared/entities/location.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.GENERAL_STATISTICS)
@Controller({ path: 'admin/general-statistics', version: '1' })
export class GeneralStatisticsController {
  constructor(private readonly generalStatisticsService: GeneralStatisticsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(GeneralStatisticsDto, 'General statistics.')
  @Get()
  findAll(@Query() findGeneralStatisticsDto: FindGeneralStatisticsDto): Promise<{
    latestVendors: Vendor[];
    ordersCount: number;
    governoratesWithVendorsAndCustomersAndOrdersCount: Location[];
    latestOrders: Order[];
    customersCount: number;
    vendorsCount: number;
    usersCount: number;
  }> {
    return this.generalStatisticsService.findAll(findGeneralStatisticsDto);
  }
}
