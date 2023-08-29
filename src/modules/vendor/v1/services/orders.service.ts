import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../../shared/entities/order.entity';
import { VendorsService } from './vendors.service';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { Vendor } from '../../../shared/entities/vendor.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vendorsService: VendorsService,
  ) {}

  // find one by id.
  findOneById(id: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id, serviceType },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, serviceType: ServiceType, failureMessage?: string, relations?: FindOptionsRelations<Order>): Promise<Order> {
    const order: Order = await this.findOneById(id, serviceType, relations);
    if (!order) {
      throw new NotFoundException(failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(vendorId: number, findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    const vendor: Vendor = await this.vendorsService.findOneOrFailById(vendorId);
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.customerAddress', 'customerAddress')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.orderStatusHistories', 'orderStatusHistory')
      .where('order.vendorId = :vendorId', { vendorId })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: vendor.serviceType,
      })
      .andWhere('order.status IN (:...statuses)', {
        statuses: findAllOrdersDto.statuses,
      })
      .addOrderBy('CASE order.status ' + findAllOrdersDto.statuses.map((status, index) => `WHEN '${status}' THEN ${index} `).join('') + 'ELSE ' + (findAllOrdersDto.statuses.length + 1) + ' END')
      .getMany();
  }
}
