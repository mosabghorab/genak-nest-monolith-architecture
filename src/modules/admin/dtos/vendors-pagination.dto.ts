import { Expose, Type } from 'class-transformer';
import { VendorDto } from '../../shared/dtos/vendor.dto';

export class VendorsPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => VendorDto)
  data: VendorDto[];
}
