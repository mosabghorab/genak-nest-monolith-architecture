import { Expose, Type } from 'class-transformer';
import { VendorDto } from './vendor.dto';
import { LocationDto } from './location.dto';

export class LocationVendorDto {
  @Expose()
  id: number;

  @Expose()
  vendorId: number;

  @Expose()
  locationId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;

  @Expose()
  @Type(() => LocationDto)
  location: LocationDto;
}
