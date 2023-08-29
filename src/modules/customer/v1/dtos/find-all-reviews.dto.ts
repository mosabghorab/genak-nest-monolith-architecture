import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '../../../shared/enums/service-type.enum';

export class FindAllReviewsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsString()
  orderUniqueId?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date?: Date;
}
