import { Expose, Type } from 'class-transformer';
import { OrderDto } from '../../../../shared/v1/dtos/order.dto';

export class VendorOrdersPaginationDto {
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
  ordersAverageTimeMinutes: number;

  @Expose()
  @Type(() => OrderDto)
  data: OrderDto[];
}
