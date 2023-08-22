import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClientUserType } from '../../shared/enums/client-user-type.enum';
import { ServiceType } from '../../shared/enums/service-type.enum';

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
}
