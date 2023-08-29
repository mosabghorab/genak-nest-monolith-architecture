import { IsNumber, IsString, Matches } from 'class-validator';
import { Constants } from '../../../../../core/constants';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  governorateId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  regionId: number;
}
