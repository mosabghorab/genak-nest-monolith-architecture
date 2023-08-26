import { Expose, Type } from 'class-transformer';
import { CustomerStatus } from '../../customer/enums/customer-status.enum';
import { LocationDto } from './location.dto';
import { CustomerAddressDto } from '../../customer/dtos/customer-address.dto';
import { OrderDto } from './order.dto';
import { ReviewDto } from './review.dto';

export class CustomerDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  status: CustomerStatus;

  @Expose()
  governorateId: number;

  @Expose()
  regionId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => LocationDto)
  governorate: LocationDto;

  @Expose()
  @Type(() => LocationDto)
  region: LocationDto;

  @Expose()
  @Type(() => CustomerAddressDto)
  customerAddresses: CustomerAddressDto[];

  @Expose()
  @Type(() => OrderDto)
  orders: OrderDto[];

  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  // extra fields.
  @Expose()
  accessToken: string;

  @Expose()
  ordersCount: number;
}
