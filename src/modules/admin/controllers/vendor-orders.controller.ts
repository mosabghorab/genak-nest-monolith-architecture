import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { VendorOrdersService } from '../services/vendor-orders.service';
import { VendorOrdersPaginationDto } from '../dtos/vendor-orders-pagination.dto';
import { FindVendorOrdersDto } from '../dtos/find-vendor-orders.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller('admin/vendor-orders')
export class VendorOrdersController {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorOrdersPaginationDto, 'All vendor orders.')
  @Get(':id')
  findAll(
    @Param('id') id: number,
    @Query() findVendorOrdersDto: FindVendorOrdersDto,
  ) {
    return this.vendorOrdersService.findAll(id, findVendorOrdersDto);
  }
}
