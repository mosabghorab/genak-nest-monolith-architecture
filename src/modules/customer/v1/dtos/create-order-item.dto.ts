import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsNumber()
  quantity: number;
}
