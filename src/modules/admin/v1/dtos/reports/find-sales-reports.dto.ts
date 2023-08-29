import { IsEnum } from 'class-validator';
import { ServiceType } from '../../../../shared/enums/service-type.enum';

export class FindSalesReportsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
