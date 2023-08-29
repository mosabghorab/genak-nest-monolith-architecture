import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OrderItem } from '../../../shared/entities/order-item.entity';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

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
    totalSales: string;
    totalQuantities: string;
  }> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption) {
      if (dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: startDate,
          endDate: endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<OrderItem> = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select(['SUM(orderItem.price) AS totalSales', 'SUM(orderItem.quantity) AS totalQuantities'])
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
