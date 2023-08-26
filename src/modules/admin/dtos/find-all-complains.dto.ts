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
import { ComplainStatus } from '../../shared/enums/complain-status.enum';
import { DateFilterOption } from '../enums/date-filter-options.enum';

export class FindAllComplainsDto {
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

  @IsEnum(ClientUserType)
  userType: ClientUserType;

  @IsOptional()
  @IsEnum(ComplainStatus)
  status?: ComplainStatus;

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
}
