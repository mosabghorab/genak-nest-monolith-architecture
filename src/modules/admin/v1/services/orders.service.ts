import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from '../../../shared/entities/order.entity';
import { FindAllOrdersDto } from '../dtos/orders/find-all-orders.dto';
import { DateFilterOption } from '../../enums/date-filter-options.enum';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Order>): Promise<Order> {
    const order: Order = await this.findOneById(id, relations);
    if (!order) {
      throw new BadRequestException(failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(findAllOrdersDto: FindAllOrdersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Order[];
    currentPage: number;
  }> {
    const offset: number = (findAllOrdersDto.page - 1) * findAllOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllOrdersDto.startDate,
        endDate: findAllOrdersDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllOrdersDto.dateFilterOption);
    }
    const [orders, count]: [Order[], number] = await this.orderRepository.findAndCount({
      where: {
        serviceType: findAllOrdersDto.serviceType,
        status: findAllOrdersDto.status,
        createdAt: Between(dateRange.startDate, dateRange.endDate),
      },
      relations: {
        customer: true,
        vendor: true,
      },
      skip: offset,
      take: findAllOrdersDto.limit,
    });
    return {
      perPage: findAllOrdersDto.limit,
      currentPage: findAllOrdersDto.page,
      lastPage: Math.ceil(count / findAllOrdersDto.limit),
      total: count,
      data: orders,
    };
  }

  // remove.
  async remove(id: number): Promise<Order> {
    const order: Order = await this.findOneOrFailById(id);
    return this.orderRepository.remove(order);
  }

  // count.
  count(serviceType?: ServiceType, dateFilterOption?: DateFilterOption, startDate?: Date, endDate?: Date): Promise<number> {
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
    return this.orderRepository.count({
      where: { serviceType, createdAt: dateFilterOption ? Between(dateRange.startDate, dateRange.endDate) : null },
    });
  }

  // total sales.
  async totalSales(
    serviceType: ServiceType,
    dateFilterOption?: DateFilterOption,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalSales: string;
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
    const queryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'totalSales')
      .where('order.serviceType = :serviceType', { serviceType });
    if (dateFilterOption) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    return queryBuilder.getRawOne();
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      where: { serviceType },
      relations,
      take: count,
    });
  }
}
