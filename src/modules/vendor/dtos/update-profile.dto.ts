import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Constants } from '../../../core/constants';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  commercialName?: string;

  @IsOptional()
  @Matches(Constants.phoneValidationRegx, {
    message: 'Invalid phone format.',
  })
  phone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  available?: boolean;
}
