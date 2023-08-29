import { IsDate, IsEnum, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '../../../../shared/enums/service-type.enum';
import { DateFilterOption } from '../../../enums/date-filter-options.enum';
import { OrderStatus } from '../../../../shared/enums/order-status.enum';

export class FindCustomerOrdersDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

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
}
