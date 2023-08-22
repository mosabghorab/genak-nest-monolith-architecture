import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateComplainDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  orderId: number;

  @IsString()
  note: string;
}
