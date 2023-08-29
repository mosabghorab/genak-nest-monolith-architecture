import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../../../shared/v1/dtos/location.dto';
import { ProductDto } from '../../../../shared/v1/dtos/product.dto';

export class SalesReportsDto {
  @Expose()
  ordersCount: number;

  @Expose()
  totalSales: number;

  @Expose()
  customOrderItemsTotalSales: number;

  @Expose()
  customOrderItemsTotalQuantities: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithOrdersCount: LocationDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithTotalSales: ProductDto[];
}
