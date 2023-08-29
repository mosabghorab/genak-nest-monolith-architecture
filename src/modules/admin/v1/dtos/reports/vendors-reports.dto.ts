import { Expose, Type } from 'class-transformer';
import { LocationDto } from '../../../../shared/v1/dtos/location.dto';

export class VendorsReportsDto {
  @Expose()
  documentsRequiredVendorsCount: number;

  @Expose()
  pendingVendorsCount: number;

  @Expose()
  activeVendorsCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithVendorsCount: LocationDto[];
}
