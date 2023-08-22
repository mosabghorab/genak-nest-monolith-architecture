import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserType } from '../../shared/enums/user-type.enum';
import { AllowFor } from '../../../core/metadata/allow-for.metadata';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { GetAuthedUser } from '../../../core/custom-decorators/get-authed-user.decorator';
import { AuthedUser } from '../../../core/types/authed-user.type';
import { OrderDto } from '../../shared/dtos/order.dto';
import { Serialize } from '../../../core/interceptors/serialize.interceptor';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';

@AllowFor(UserType.CUSTOMER)
@Controller('customer/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Serialize(OrderDto, 'Order created successfully.')
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(authedUser.id, createOrderDto);
  }

  @Serialize(OrderDto, 'All orders.')
  @Get()
  findAll(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findAllOrdersDto: FindAllOrdersDto,
  ) {
    return this.ordersService.findAll(authedUser.id, findAllOrdersDto, {
      vendor: true,
      orderItems: true,
      orderStatusHistories: true,
    });
  }

  @Serialize(OrderDto, 'Order re ordered successfully.')
  @Post(':id/re-order')
  reOrder(@Param('id') id: number) {
    return this.ordersService.reOrder(id);
  }
}
