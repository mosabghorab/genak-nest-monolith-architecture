import { IsDate, IsEnum, ValidateIf } from 'class-validator';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { DateFilterOption } from '../enums/date-filter-options.enum';
import { Transform } from 'class-transformer';

export class FindSalesReportsWithFilterDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

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
