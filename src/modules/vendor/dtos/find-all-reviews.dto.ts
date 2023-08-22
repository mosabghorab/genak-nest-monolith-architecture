import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllReviewsDto {
  @IsOptional()
  @IsString()
  orderUniqueId?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date?: Date;
}
