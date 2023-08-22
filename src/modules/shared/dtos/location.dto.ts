import { Expose, Type } from 'class-transformer';
import { VendorDto } from './vendor.dto';
import { LocationVendorDto } from './location-vendor.dto';
import { CustomerDto } from './customer.dto';

export class LocationDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  parentId: number;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => LocationDto)
  parent: LocationDto;

  @Expose()
  @Type(() => LocationDto)
  locations: LocationDto[];

  @Expose()
  @Type(() => VendorDto)
  vendors: VendorDto[];

  @Expose()
  @Type(() => LocationVendorDto)
  locationsVendors: LocationVendorDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersByGovernorate: CustomerDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersByRegion: CustomerDto[];
}
