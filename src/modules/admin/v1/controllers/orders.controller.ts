import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { OrdersService } from '../services/orders.service';
import { OrdersPaginationDto } from '../dtos/orders/orders-pagination.dto';
import { FindAllOrdersDto } from '../dtos/orders/find-all-orders.dto';
import { OrderDto } from '../../../shared/v1/dtos/order.dto';
import { Order } from '../../../shared/entities/order.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller({ path: 'admin/orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrdersPaginationDto, 'All orders.')
  @Get()
  findAll(@Query() findAllOrdersDto: FindAllOrdersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Order[];
    currentPage: number;
  }> {
    return this.ordersService.findAll(findAllOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrderDto, 'One order.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOneOrFailById(id, null, {
      customer: true,
      vendor: true,
      customerAddress: true,
      orderItems: true,
      orderStatusHistories: true,
    });
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OrderDto, 'Order deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Order> {
    return this.ordersService.remove(id);
  }
}
