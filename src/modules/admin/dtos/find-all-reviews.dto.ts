import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { DateFilterOption } from '../enums/date-filter-options.enum';

export class FindAllReviewsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.vendorId === null)
  customerId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.customerId === null)
  vendorId: number;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsEnum(ClientUserType)
  reviewedBy: ClientUserType;

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
