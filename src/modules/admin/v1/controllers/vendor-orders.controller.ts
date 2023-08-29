import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { VendorOrdersService } from '../services/vendor-orders.service';
import { VendorOrdersPaginationDto } from '../dtos/vendor-orders/vendor-orders-pagination.dto';
import { FindVendorOrdersDto } from '../dtos/vendor-orders/find-vendor-orders.dto';
import { Order } from '../../../shared/entities/order.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/vendor-orders', version: '1' })
export class VendorOrdersController {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorOrdersPaginationDto, 'All vendor orders.')
  @Get(':id')
  findAll(
    @Param('id') id: number,
    @Query() findVendorOrdersDto: FindVendorOrdersDto,
  ): Promise<{
    total: number;
    perPage: number;
    ordersAverageTimeMinutes: number;
    lastPage: number;
    data: Order[];
    ordersTotalPrice: any;
    currentPage: number;
  }> {
    return this.vendorOrdersService.findAll(id, findVendorOrdersDto);
  }
}
