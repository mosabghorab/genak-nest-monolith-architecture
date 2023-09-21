import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerAddress } from '../../customer/entities/customer-address.entity';
import { ServiceType } from '../enums/service-type.enum';
import { OrderStatus } from '../enums/order-status.enum';
import { Customer } from './customer.entity';
import { Vendor } from './vendor.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { Review } from './review.entity';
import { Complain } from './complain.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  uniqueId?: string;

  @Column()
  customerId: number;

  @Column()
  vendorId: number;

  @Column()
  customerAddressId: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'numeric' })
  total: number;

  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ nullable: true })
  averageTimeMinutes?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.order, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Complain, (complain) => complain.order, { cascade: true })
  complains: Complain[];

  @OneToMany(() => OrderStatusHistory, (orderStatusHistory) => orderStatusHistory.order, {
    cascade: true,
  })
  orderStatusHistories: OrderStatusHistory[];

  // many to one.
  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ManyToOne(() => CustomerAddress, (customerAddress) => customerAddress.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerAddressId' })
  customerAddress: CustomerAddress;
}
