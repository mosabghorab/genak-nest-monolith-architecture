import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../../shared/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { ServiceType } from '../../../shared/enums/service-type.enum';
import { OrderStatus } from '../../../shared/enums/order-status.enum';
import { VendorsService } from './vendors.service';
import { CustomerAddressesService } from './customer-addresses.service';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { OrderStatusHistory } from '../../../shared/entities/order-status-history.entity';
import { OrderItem } from '../../../shared/entities/order-item.entity';
import { CustomerAddress } from '../../entities/customer-address.entity';
import { Vendor } from '../../../shared/entities/vendor.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vendorsService: VendorsService,
    private readonly customerAddressesService: CustomerAddressesService,
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

  // find all.
  findAll(customerId: number, findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        customerId,
        serviceType: findAllOrdersDto.serviceType,
        status: findAllOrdersDto.status,
      },
      relations: {
        vendor: true,
        orderItems: true,
        orderStatusHistories: true,
      },
    });
  }

  // create.
  async create(customerId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const vendor: Vendor = await this.vendorsService.findOneOrFailById(createOrderDto.vendorId);
    const customerAddress: CustomerAddress = await this.customerAddressesService.findOneOrFailById(createOrderDto.customerAddressId);
    const order: Order = await this.orderRepository.create({
      customerId,
      vendorId: createOrderDto.vendorId,
      customerAddressId: createOrderDto.customerAddressId,
      serviceType: createOrderDto.serviceType,
      note: createOrderDto.note,
      total: createOrderDto.total,
    });
    order.vendor = vendor;
    order.customerAddress = customerAddress;
    const savedOrder: Order = await this.orderRepository.save(order);
    savedOrder.orderItems = createOrderDto.orderItems.map((e: CreateOrderItemDto) => <OrderItem>{ orderId: savedOrder.id, ...e });
    savedOrder.uniqueId = `${savedOrder.serviceType === ServiceType.WATER ? 'W-' : 'G-'}${new Date().getFullYear()}${savedOrder.id}`;
    savedOrder.orderStatusHistories = [
      <OrderStatusHistory>{
        orderId: savedOrder.id,
        orderStatus: OrderStatus.PENDING,
      },
    ];
    return this.orderRepository.save(savedOrder);
  }

  // re order.
  async reOrder(id: number): Promise<Order> {
    const order: Order = await this.findOneOrFailById(id);
    const newOrder: Order = await this.orderRepository.create({
      customerId: order.customerId,
      vendorId: order.vendorId,
      customerAddressId: order.customerAddressId,
      serviceType: order.serviceType,
      note: order.note,
      total: order.total,
    });
    const savedOrder: Order = await this.orderRepository.save(newOrder);
    savedOrder.orderItems = order.orderItems.map((e: OrderItem) => {
      e.id = null;
      return <OrderItem>{ orderId: savedOrder.id, ...e };
    });
    savedOrder.uniqueId = `${savedOrder.serviceType === ServiceType.WATER ? 'W-' : 'G-'}${new Date().getFullYear()}${savedOrder.id}`;
    savedOrder.orderStatusHistories = [
      <OrderStatusHistory>{
        orderId: savedOrder.id,
        orderStatus: OrderStatus.PENDING,
      },
    ];
    return this.orderRepository.save(savedOrder);
  }
}
