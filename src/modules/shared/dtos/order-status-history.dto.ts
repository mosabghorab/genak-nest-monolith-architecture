import { Expose, Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderDto } from './order.dto';
import { ReasonDto } from './reason.dto';

export class OrderStatusHistoryDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  reasonId: number;

  @Expose()
  orderStatus: OrderStatus;

  @Expose()
  note: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => ReasonDto)
  reason: ReasonDto;
}
