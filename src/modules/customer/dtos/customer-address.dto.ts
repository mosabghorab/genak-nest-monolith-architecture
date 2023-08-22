import { Expose, Type } from 'class-transformer';
import { CustomerDto } from '../../shared/dtos/customer.dto';

export class CustomerAddressDto {
  @Expose()
  id: number;

  @Expose()
  onMapName: string;

  @Expose()
  label: string;

  @Expose()
  description: string;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
