import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  orderId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  customerId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  rate: number;
}
