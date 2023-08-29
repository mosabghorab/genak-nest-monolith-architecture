import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../../../shared/v1/dtos/location.dto';
import { ProductDto } from '../../../../shared/v1/dtos/product.dto';
import { VendorDto } from '../../../../shared/v1/dtos/vendor.dto';
import { CustomerDto } from '../../../../shared/v1/dtos/customer.dto';

export class SalesReportsWithFilterDto {
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
  @Type(() => LocationDto)
  regionsWithOrdersCount: LocationDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithTotalSales: ProductDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithOrdersCount: ProductDto[];

  @Expose()
  @Type(() => VendorDto)
  vendorsBestSellersWithOrdersCount: VendorDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersBestBuyersWithOrdersCount: CustomerDto[];
}
