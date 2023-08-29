import { IsArray, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../shared/enums/order-status.enum';
import { Transform } from 'class-transformer';

export class FindAllOrdersDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  statuses?: OrderStatus[] = Object.values(OrderStatus);
}
