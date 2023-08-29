import { Expose, Type } from 'class-transformer';
import { OrderDto } from '../../../../shared/v1/dtos/order.dto';

export class CustomerOrdersPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  ordersTotalPrice: number;

  @Expose()
  @Type(() => OrderDto)
  data: OrderDto[];
}
