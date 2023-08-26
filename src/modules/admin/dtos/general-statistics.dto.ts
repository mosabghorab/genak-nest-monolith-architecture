import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../shared/dtos/location.dto';
import { OrderDto } from '../../shared/dtos/order.dto';
import { VendorDto } from '../../shared/dtos/vendor.dto';

export class GeneralStatisticsDto {
  @Expose()
  usersCount: number;

  @Expose()
  customersCount: number;

  @Expose()
  vendorsCount: number;

  @Expose()
  ordersCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithVendorsAndCustomersAndOrdersCount: LocationDto[];

  @Expose()
  @Type(() => OrderDto)
  latestOrders: OrderDto[];

  @Expose()
  @Type(() => VendorDto)
  latestVendors: VendorDto[];
}
