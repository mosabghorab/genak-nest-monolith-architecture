import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../shared/entities/order.entity';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ReasonsService } from './reasons.service';
import { OrderStatusHistory } from '../entities/order-status-history.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // private readonly orderStatusHistoryService: OrderStatusHistoryService,
    private readonly reasonsService: ReasonsService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Order>) {
    return this.orderRepository.findOne({ where: { id }, relations });
  }

  // update status.
  async updateStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.findOneById(orderId, {
      orderStatusHistories: true,
    });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    if (updateOrderStatusDto.reasonId) {
      const reason = await this.reasonsService.findOneById(
        updateOrderStatusDto.reasonId,
      );
      if (!reason) {
        throw new NotFoundException('Reason not found.');
      }
      updateOrderStatusDto.note = reason.name;
    }
    order.status = updateOrderStatusDto.status;
    const orderStatusHistory: OrderStatusHistory = new OrderStatusHistory();
    Object.assign(orderStatusHistory, {
      orderId,
      orderStatus: updateOrderStatusDto.status,
      reasonId: updateOrderStatusDto.reasonId,
      note: updateOrderStatusDto.note,
    });
    order.orderStatusHistories.push(orderStatusHistory);
    return this.orderRepository.save(order);
  }
}
