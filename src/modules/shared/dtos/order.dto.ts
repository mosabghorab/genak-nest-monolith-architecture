import { Expose, Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { ServiceType } from '../enums/service-type.enum';
import { OrderItemDto } from './order-item.dto';
import { OrderStatusHistoryDto } from './order-status-history.dto';
import { VendorDto } from './vendor.dto';
import { CustomerDto } from './customer.dto';
import { CustomerAddressDto } from '../../customer/dtos/customer-address.dto';
import { ReviewDto } from './review.dto';
import { ComplainDto } from './complain.dto';

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  uniqueId: number;

  @Expose()
  customerId: number;

  @Expose()
  vendorId: number;

  @Expose()
  customerAddressId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  status: OrderStatus;

  @Expose()
  note: string;

  @Expose()
  total: number;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  averageTimeMinutes: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;

  @Expose()
  @Type(() => CustomerAddressDto)
  customerAddress: CustomerAddressDto;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  @Type(() => OrderStatusHistoryDto)
  orderStatusHistories: OrderStatusHistoryDto[];

  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @Expose()
  @Type(() => ComplainDto)
  complains: ComplainDto[];
}
