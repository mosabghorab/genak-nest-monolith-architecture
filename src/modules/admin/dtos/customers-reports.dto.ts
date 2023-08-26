import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../shared/dtos/location.dto';

export class CustomersReportsDto {
  @Expose()
  customersCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithCustomersCount: LocationDto[];
}
