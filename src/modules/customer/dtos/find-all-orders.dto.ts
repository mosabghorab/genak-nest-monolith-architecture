import { IsEnum, IsOptional } from 'class-validator';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { OrderStatus } from '../../shared/enums/order-status.enum';

export class FindAllOrdersDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
