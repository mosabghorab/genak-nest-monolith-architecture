import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateOnBoardingScreenDto } from './create-on-boarding-screen.dto';

export class UpdateOnBoardingScreenDto extends PartialType(
  CreateOnBoardingScreenDto,
) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active?: boolean;
}
