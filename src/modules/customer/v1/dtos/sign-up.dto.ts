import { IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { Constants } from '../../../../core/constants';

export class SignUpDto {
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
