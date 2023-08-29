import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Constants } from '../../../../core/constants';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  notificationsEnabled?: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.regionId != null)
  governorateId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.governorateId != null)
  regionId: number;
}
