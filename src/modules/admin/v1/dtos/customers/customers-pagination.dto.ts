import { Expose, Type } from 'class-transformer';
import { CustomerDto } from '../../../../shared/v1/dtos/customer.dto';

export class CustomersPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => CustomerDto)
  data: CustomerDto[];
}
