import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { Transform } from 'class-transformer';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';

export class FindAllVendorsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  statuses: VendorStatus[];
}
