import { Expose, Type } from 'class-transformer';
import { OrderDto } from '../../shared/dtos/order.dto';

export class OrdersPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => OrderDto)
  data: OrderDto[];
}
