import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order } from '../../shared/entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { ServiceType } from '../../shared/enums/service-type.enum';
import { OrderStatus } from '../../shared/enums/order-status.enum';
import { VendorsService } from './vendors.service';
import { CustomerAddressesService } from './customer-addresses.service';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { OrderStatusHistory } from '../../shared/entities/order-status-history.entity';
import { OrderItem } from '../../shared/entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly vendorsService: VendorsService,
    private readonly customerAddressesService: CustomerAddressesService,
  ) {}

  // create.
  async create(customerId: number, createOrderDto: CreateOrderDto) {
    const vendor = await this.vendorsService.findOneById(
      createOrderDto.vendorId,
    );
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }
    const customerAddress = await this.customerAddressesService.findOneById(
      createOrderDto.customerAddressId,
    );
    if (!customerAddress) {
      throw new NotFoundException('Customer address not found.');
    }
    const order = await this.orderRepository.create({
      customerId,
      vendorId: createOrderDto.vendorId,
      customerAddressId: createOrderDto.customerAddressId,
      serviceType: createOrderDto.serviceType,
      note: createOrderDto.note,
      total: createOrderDto.total,
    });
    order.vendor = vendor;
    order.customerAddress = customerAddress;
    const savedOrder = await this.orderRepository.save(order);
    savedOrder.orderItems = createOrderDto.orderItems.map((e) => {
      const orderItem: OrderItem = new OrderItem();
      Object.assign(orderItem, { orderId: savedOrder.id, ...e });
      return orderItem;
    });
    savedOrder.uniqueId = `${
      savedOrder.serviceType == ServiceType.WATER ? 'W-' : 'G-'
    }${new Date().getFullYear()}${savedOrder.id}`;
    const orderStatusHistory: OrderStatusHistory = new OrderStatusHistory();
    Object.assign(orderStatusHistory, {
      orderId: savedOrder.id,
      orderStatus: OrderStatus.PENDING,
    });
    savedOrder.orderStatusHistories = [orderStatusHistory];
    return this.orderRepository.save(savedOrder);
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Order>) {
    return this.orderRepository.findOne({ where: { id }, relations });
  }

  // find all.
  findAll(customerId: number, findAllOrdersDto: FindAllOrdersDto) {
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

  // re order.
  async reOrder(id: number) {
    const order = await this.findOneById(id, {
      orderItems: true,
    });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    const newOrder = await this.orderRepository.create({
      customerId: order.customerId,
      vendorId: order.vendorId,
      customerAddressId: order.customerAddressId,
      serviceType: order.serviceType,
      note: order.note,
      total: order.total,
    });
    const savedOrder = await this.orderRepository.save(newOrder);
    savedOrder.orderItems = order.orderItems.map((e) => {
      const orderItem: OrderItem = new OrderItem();
      e.id = null;
      Object.assign(orderItem, { orderId: savedOrder.id, ...e });
      return orderItem;
    });
    savedOrder.uniqueId = `${
      savedOrder.serviceType == ServiceType.WATER ? 'W-' : 'G-'
    }${new Date().getFullYear()}${savedOrder.id}`;
    const orderStatusHistory: OrderStatusHistory = new OrderStatusHistory();
    Object.assign(orderStatusHistory, {
      orderId: savedOrder.id,
      orderStatus: OrderStatus.PENDING,
    });
    savedOrder.orderStatusHistories = [orderStatusHistory];
    return this.orderRepository.save(savedOrder);
  }
}
