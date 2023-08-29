import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { ServiceType } from '../../../../shared/enums/service-type.enum';
import { Transform } from 'class-transformer';
import { VendorStatus } from '../../../../vendor/enums/vendor-status.enum';
import { DateFilterOption } from '../../../enums/date-filter-options.enum';
import { OrderByType } from '../../../../shared/enums/order-by-type.enum';

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

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  governorateId?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  regionsIds?: number[];

  @IsOptional()
  @IsEnum(DateFilterOption)
  dateFilterOption?: DateFilterOption;

  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  @ValidateIf((obg) => obg.dateFilterOption === DateFilterOption.CUSTOM)
  startDate?: Date;

  @IsDate()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  })
  @ValidateIf((obg) => obg.dateFilterOption === DateFilterOption.CUSTOM)
  endDate?: Date;

  @IsOptional()
  @IsEnum(OrderByType)
  orderByType: OrderByType = OrderByType.ASC;
}
