import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../shared/entities/order.entity';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { DateFilterOption } from '../enums/date-filter-options.enum';
import { Helpers } from '../../../core/helpers';
import { ServiceType } from '../../shared/enums/service-type.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Order>) {
    return this.orderRepository.findOne({ where: { id }, relations });
  }

  // find all.
  async findAll(findAllOrdersDto: FindAllOrdersDto) {
    const offset = (findAllOrdersDto.page - 1) * findAllOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllOrdersDto.startDate,
        endDate: findAllOrdersDto.endDate,
      };
    } else {
      dateRange = Helpers.getDateRangeForFilterOption(
        findAllOrdersDto.dateFilterOption,
      );
    }
    const [orders, count] = await this.orderRepository.findAndCount({
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
  async remove(id: number) {
    const order = await this.findOneById(id);
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    return this.orderRepository.remove(order);
  }

  // count.
  count(serviceType?: ServiceType) {
    return this.orderRepository.count({
      where: { serviceType },
    });
  }

  // total sales.
  async totalSales(serviceType: ServiceType) {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.serviceType = :serviceType', { serviceType })
      .select('SUM(order.total) as totalSales')
      .getRawOne();
  }

  // find latest.
  findLatest(
    count: number,
    serviceType: ServiceType,
    relations?: FindOptionsRelations<Order>,
  ) {
    return this.orderRepository.find({
      where: { serviceType },
      relations,
      take: count,
    });
  }
}
