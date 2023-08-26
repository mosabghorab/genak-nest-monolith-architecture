import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { AdminMustCanDo } from '../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionsTarget } from '../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../enums/permission-group.enum';
import { OrdersService } from '../services/orders.service';
import { OrdersPaginationDto } from '../dtos/orders-pagination.dto';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { OrderDto } from '../../shared/dtos/order.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ORDERS)
@Controller('admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrdersPaginationDto, 'All orders.')
  @Get()
  findAll(@Query() findAllOrdersDto: FindAllOrdersDto) {
    return this.ordersService.findAll(findAllOrdersDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OrderDto, 'One order.')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const order = await this.ordersService.findOneById(id, {
      customer: true,
      vendor: true,
      customerAddress: true,
      orderItems: true,
      orderStatusHistories: true,
    });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    return order;
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OrderDto, 'Order deleted successfully.')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.ordersService.remove(id);
  }
}
