import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { OrdersService } from '../services/orders.service';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { OrderDto } from '../../shared/dtos/order.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';

@AllowFor(UserType.VENDOR)
@Controller('vendor/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Serialize(OrderDto, 'All orders.')
  @Get()
  findAll(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findAllOrdersDto: FindAllOrdersDto,
  ) {
    return this.ordersService.findAll(authedUser.id, findAllOrdersDto, {
      customer: true,
      customerAddress: true,
      orderItems: true,
      orderStatusHistories: true,
    });
  }
}
