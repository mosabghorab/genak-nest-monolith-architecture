import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../shared/entities/order.entity';
import { VendorsService } from './vendors.service';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { Helpers } from '../../../core/helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vendorsService: VendorsService,
  ) {}

  // find one by id.
  findOneById(
    id: number,
    serviceType: ServiceType,
    relations?: FindOptionsRelations<Order>,
  ) {
    return this.orderRepository.findOne({
      where: { id, serviceType },
      relations,
    });
  }

  // find all.
  async findAll(
    vendorId: number,
    findAllOrdersDto: FindAllOrdersDto,
    relations?: FindOptionsRelations<Order>,
  ) {
    const vendor = await this.vendorsService.findOneById(vendorId);
    const queryBuilder = await this.orderRepository.createQueryBuilder('order');
    if (relations) {
      Helpers.buildRelationsForQueryBuilder<Order>(
        queryBuilder,
        relations,
        'order',
      );
    }
    return await queryBuilder
      .where('order.vendorId = :vendorId', { vendorId })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: vendor.serviceType,
      })
      .andWhere('order.status IN (:...statuses)', {
        statuses: findAllOrdersDto.statuses,
      })
      .addOrderBy(
        'CASE order.status ' +
          findAllOrdersDto.statuses
            .map((status, index) => `WHEN '${status}' THEN ${index} `)
            .join('') +
          'ELSE ' +
          (findAllOrdersDto.statuses.length + 1) +
          ' END',
      )
      .getMany();
  }
}