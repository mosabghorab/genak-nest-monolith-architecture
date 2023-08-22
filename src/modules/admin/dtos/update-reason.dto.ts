import { PartialType } from '@nestjs/mapped-types';
import { CreateReasonDto } from './create-reason.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateReasonDto extends PartialType(CreateReasonDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active?: boolean;
}
