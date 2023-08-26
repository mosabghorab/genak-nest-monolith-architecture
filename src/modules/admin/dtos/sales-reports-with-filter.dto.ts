import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../shared/dtos/location.dto';
import { ProductDto } from '../../shared/dtos/product.dto';
import { VendorDto } from '../../shared/dtos/vendor.dto';
import { CustomerDto } from '../../shared/dtos/customer.dto';

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
  vendorsBestSellerWithOrdersCount: VendorDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersBestBuyerWithOrdersCount: CustomerDto[];
}
