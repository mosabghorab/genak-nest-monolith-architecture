import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from '../../../shared/entities/order.entity';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { Helpers } from '../../../../core/helpers';
import { FindVendorOrdersDto } from '../dtos/vendor-orders/find-vendor-orders.dto';
import { VendorsService } from './vendors.service';

@Injectable()
export class VendorOrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vendorsService: VendorsService,
  ) {}

  // find all.
  async findAll(
    vendorId: number,
    findVendorOrdersDto: FindVendorOrdersDto,
  ): Promise<{
    total: number;
    perPage: number;
    ordersAverageTimeMinutes: number;
    lastPage: number;
    data: Order[];
    ordersTotalPrice: any;
    currentPage: number;
  }> {
    await this.vendorsService.findOneOrFailById(vendorId);
    const { ordersAverageTimeMinutes } = await this.orderRepository
      .createQueryBuilder('order')
      .select('AVG(order.averageTimeMinutes)', 'ordersAverageTimeMinutes')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersDto.serviceType,
      })
      .getRawOne();
    const offset: number = (findVendorOrdersDto.page - 1) * findVendorOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findVendorOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findVendorOrdersDto.startDate,
        endDate: findVendorOrdersDto.endDate,
      };
    } else {
      dateRange = Helpers.getDateRangeForFilterOption(findVendorOrdersDto.dateFilterOption);
    }
    const mainQueryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findVendorOrdersDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findVendorOrdersDto.status,
      });
    }
    const [orders, count]: [Order[], number] = await mainQueryBuilder.clone().leftJoinAndSelect('order.customer', 'customer').skip(offset).take(findVendorOrdersDto.limit).getManyAndCount();
    const { ordersTotalPrice } = await mainQueryBuilder.clone().select('SUM(order.total)', 'ordersTotalPrice').getRawOne();
    return {
      perPage: findVendorOrdersDto.limit,
      currentPage: findVendorOrdersDto.page,
      lastPage: Math.ceil(count / findVendorOrdersDto.limit),
      total: count,
      ordersTotalPrice: ordersTotalPrice || 0,
      ordersAverageTimeMinutes: Math.floor(ordersAverageTimeMinutes) || 0,
      data: orders,
    };
  }
}
