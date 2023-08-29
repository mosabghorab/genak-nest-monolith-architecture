import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OrderItem } from '../../../shared/entities/order-item.entity';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { Helpers } from '../../../../core/helpers';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // find custom order items total sales and quantities.
  async findCustomOrderItemsTotalSalesAndQuantities(
    dateFilterOption?: DateFilterOption,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    customOrderItemsTotalSales: string;
    customOrderItemsTotalQuantities: string;
  }> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption) {
      if (dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: startDate,
          endDate: endDate,
        };
      } else {
        dateRange = Helpers.getDateRangeForFilterOption(dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<OrderItem> = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select(['SUM(orderItem.price) AS customOrderItemsTotalSales', 'SUM(orderItem.quantity) AS customOrderItemsTotalQuantities'])
      .where('orderItem.productId IS NULL');
    if (dateFilterOption) {
      queryBuilder.andWhere('orderItem.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    return queryBuilder.getRawOne();
  }
}
