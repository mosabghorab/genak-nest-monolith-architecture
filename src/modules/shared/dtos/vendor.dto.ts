import { Expose, Type } from 'class-transformer';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';
import { ServiceType } from '../enums/service-type.enum';
import { LocationDto } from './location.dto';
import { LocationVendorDto } from './location-vendor.dto';
import { OrderDto } from './order.dto';
import { ReviewDto } from './review.dto';
import { AttachmentDto } from './attachment.dto';

export class VendorDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  commercialName: string;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  governorateId: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  avatar: string;

  @Expose()
  maxProducts: number;

  @Expose()
  maxOrders: number;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  available: boolean;

  @Expose()
  status: VendorStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => LocationDto)
  governorate: LocationDto;

  @Expose()
  @Type(() => LocationVendorDto)
  locationsVendors: LocationVendorDto[];

  @Expose()
  @Type(() => OrderDto)
  orders: OrderDto[];

  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @Expose()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];

  // extra fields.
  @Expose()
  accessToken: string;

  @Expose()
  ordersCount: number;
}
