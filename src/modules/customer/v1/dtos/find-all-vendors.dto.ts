import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '../../../shared/enums/service-type.enum';

export class FindAllVendorsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  governorateId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  regionsIds?: number[];
}
