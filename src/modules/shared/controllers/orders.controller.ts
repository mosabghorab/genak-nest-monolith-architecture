import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserType } from '../enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { OrdersService } from '../services/orders.service';
import { OrderDto } from '../../shared/dtos/order.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR, UserType.ADMIN)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Serialize(OrderDto, 'Order status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
