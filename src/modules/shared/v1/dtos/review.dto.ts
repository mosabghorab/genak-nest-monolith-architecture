import { Expose, Type } from 'class-transformer';
import { OrderDto } from './order.dto';
import { ServiceType } from '../../enums/service-type.enum';
import { CustomerDto } from './customer.dto';
import { VendorDto } from './vendor.dto';
import { ClientUserType } from '../../enums/client-user-type.enum';

export class ReviewDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  customerId: number;

  @Expose()
  vendorId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  reviewedBy: ClientUserType;

  @Expose()
  rate: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;
}
