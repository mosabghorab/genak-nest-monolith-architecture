import { IsEnum } from 'class-validator';
import { ServiceType } from '../../shared/enums/service-type.enum';

export class FindGeneralStatisticsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
