import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  price?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active?: boolean;
}
