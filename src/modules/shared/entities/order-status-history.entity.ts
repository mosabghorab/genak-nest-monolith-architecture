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
import { Reason } from './reason.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity()
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column({ nullable: true })
  reasonId?: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  orderStatus: OrderStatus;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.

  // many to one.
  @ManyToOne(() => Order, (order) => order.orderStatusHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Reason, (reason) => reason.orderStatusHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reasonId' })
  reason?: Reason;
}
