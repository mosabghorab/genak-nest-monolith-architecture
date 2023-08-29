import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { Constants } from '../../../../../core/constants';
import { VendorStatus } from '../../../../vendor/enums/vendor-status.enum';
import { Transform } from 'class-transformer';

export class UpdateVendorDto {
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
  @IsEnum(VendorStatus)
  status?: VendorStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxProducts?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.regionsIds != null)
  governorateId?: number;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  @ValidateIf((obj) => obj.governorateId != null)
  regionsIds?: number[];
}
