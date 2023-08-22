import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Constants } from '../../../core/constants';
import { ServiceType } from '../../shared/enums/service-type.enum';

export class SignUpDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  name: string;

  @IsString()
  commercialName: string;

  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  governorateId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxProducts: number;
}
