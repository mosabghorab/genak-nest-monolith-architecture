import { Expose, Type } from 'class-transformer';
import { ServiceType } from '../enums/service-type.enum';
import { OrderItemDto } from './order-item.dto';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  price: number;

  @Expose()
  size: number;

  @Expose()
  image: string;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
