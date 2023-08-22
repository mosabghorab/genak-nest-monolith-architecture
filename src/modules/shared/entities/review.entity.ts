import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Customer } from './customer.entity';
import { Vendor } from './vendor.entity';
import { ServiceType } from '../enums/service-type.enum';
import { ClientUserType } from '../enums/client-user-type.enum';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  customerId: number;

  @Column()
  vendorId: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: ClientUserType,
  })
  reviewedBy: ClientUserType;

  @Column({ type: 'smallint' })
  rate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.

  // many to one.
  @ManyToOne(() => Order, (order) => order.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Vendor, (vendor) => vendor.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  vendor: Vendor;
}
