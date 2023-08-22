import { Expose, Type } from 'class-transformer';
import { ServiceType } from '../enums/service-type.enum';
import { ComplainStatus } from '../enums/complain-status.enum';
import { OrderDto } from './order.dto';
import { ClientUserType } from '../enums/client-user-type.enum';

export class ComplainDto {
  @Expose()
  id: number;

  @Expose()
  complainerId: number;

  @Expose()
  complainerUserType: ClientUserType;

  @Expose()
  orderId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  status: ComplainStatus;

  @Expose()
  note: string;

  @Expose()
  image: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;
}
