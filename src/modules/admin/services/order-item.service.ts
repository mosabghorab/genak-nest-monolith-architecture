import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../shared/entities/order-item.entity';
import { ServiceType } from '../../shared/enums/service-type.enum';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // find custom order items total sales and quantities.
  findCustomOrderItemsTotalSalesAndQuantities(serviceType: ServiceType) {
    return this.orderItemRepository
      .createQueryBuilder('orderItem')
      .where('orderItem.productId IS NULL')
      .select([
        'SUM(orderItem.price) AS customOrderItemsTotalSales',
        'SUM(orderItem.quantity) AS customOrderItemsTotalQuantities',
      ])
      .groupBy('orderItem.id')
      .getRawOne();
  }
}
