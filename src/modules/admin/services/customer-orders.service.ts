import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../shared/entities/order.entity';
import { DateFilterOption } from '../enums/date-filter-options.enum';
import { Helpers } from '../../../core/helpers';
import { FindCustomerOrdersDto } from '../dtos/find-customer-orders.dto';
import { CustomersService } from './customers.service';

@Injectable()
export class CustomerOrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly customersService: CustomersService,
  ) {}

  // find all.
  async findAll(
    customerId: number,
    findCustomerOrdersDto: FindCustomerOrdersDto,
  ) {
    const customer = await this.customersService.findOneById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const offset =
      (findCustomerOrdersDto.page - 1) * findCustomerOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findCustomerOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findCustomerOrdersDto.startDate,
        endDate: findCustomerOrdersDto.endDate,
      };
    } else {
      dateRange = Helpers.getDateRangeForFilterOption(
        findCustomerOrdersDto.dateFilterOption,
      );
    }
    const mainQueryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.customerId = :customerId', {
        customerId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findCustomerOrdersDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findCustomerOrdersDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findCustomerOrdersDto.status,
      });
    }
    const [orders, count] = await mainQueryBuilder
      .clone()
      .leftJoinAndSelect('order.vendor', 'vendor')
      .skip(offset)
      .take(findCustomerOrdersDto.limit)
      .getManyAndCount();

    const { ordersTotalPrice } = await mainQueryBuilder
      .clone()
      .select('SUM(order.total)', 'ordersTotalPrice')
      .getRawOne();
    return {
      perPage: findCustomerOrdersDto.limit,
      currentPage: findCustomerOrdersDto.page,
      lastPage: Math.ceil(count / findCustomerOrdersDto.limit),
      total: count,
      ordersTotalPrice: ordersTotalPrice || 0,
      data: orders,
    };
  }
}
