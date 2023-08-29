import { Expose, Type } from 'class-transformer';
import { OrderDto } from './order.dto';
import { ProductDto } from './product.dto';

export class OrderItemDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  productId: number;

  @Expose()
  price: number;

  @Expose()
  productName: string;

  @Expose()
  quantity: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;
}
