import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ReasonsService } from './reasons.service';
import { OrderStatusHistory } from '../../entities/order-status-history.entity';
import { OrderStatus } from '../../enums/order-status.enum';
import { Reason } from '../../entities/reason.entity';
import { DateHelpers } from '../../../../core/helpers/date.helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly reasonsService: ReasonsService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Order>): Promise<Order> {
    const order: Order = await this.findOneById(id, relations);
    if (!order) {
      throw new NotFoundException(failureMessage || 'Order not found.');
    }
    return order;
  }

  // update status.
  async updateStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order: Order = await this.findOneOrFailById(orderId, null, {
      orderStatusHistories: true,
    });
    if (updateOrderStatusDto.reasonId) {
      const reason: Reason = await this.reasonsService.findOneOrFailById(updateOrderStatusDto.reasonId);
      updateOrderStatusDto.note = reason.name;
    }
    order.status = updateOrderStatusDto.status;
    if (order.status === OrderStatus.ACCEPTED) {
      order.startTime = new Date();
    } else if (order.status === OrderStatus.COMPLETED) {
      order.endTime = new Date();
      order.averageTimeMinutes = DateHelpers.calculateTimeDifferenceInMinutes(order.startTime, order.endTime);
    }
    order.orderStatusHistories.push(<OrderStatusHistory>{
      orderId,
      orderStatus: updateOrderStatusDto.status,
      reasonId: updateOrderStatusDto.reasonId,
      note: updateOrderStatusDto.note,
    });
    return this.orderRepository.save(order);
  }
}
