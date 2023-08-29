import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { CustomerOrdersService } from '../services/customer-orders.service';
import { FindCustomerOrdersDto } from '../dtos/customer-orders/find-customer-orders.dto';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { CustomerOrdersPaginationDto } from '../dtos/customer-orders/customer-orders-pagination.dto';
import { Order } from '../../../shared/entities/order.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/customer-orders', version: '1' })
export class CustomerOrdersController {
  constructor(private readonly customerOrdersService: CustomerOrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomerOrdersPaginationDto, 'All customer orders.')
  @Get(':id')
  findAll(
    @Param('id') id: number,
    @Query() findCustomerOrdersDto: FindCustomerOrdersDto,
  ): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Order[];
    ordersTotalPrice: any;
    currentPage: number;
  }> {
    return this.customerOrdersService.findAll(id, findCustomerOrdersDto);
  }
}
