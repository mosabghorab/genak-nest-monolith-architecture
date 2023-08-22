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
import { ServiceType } from '../enums/service-type.enum';
import { ComplainStatus } from '../enums/complain-status.enum';
import { ClientUserType } from '../enums/client-user-type.enum';

@Entity()
export class Complain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  complainerId: number;

  @Column({
    type: 'enum',
    enum: ClientUserType,
  })
  complainerUserType: ClientUserType;

  @Column()
  orderId: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: ComplainStatus,
    default: ComplainStatus.UNSOLVED,
  })
  status: ComplainStatus;

  @Column()
  note: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.

  // many to one.
  @ManyToOne(() => Order, (order) => order.complains, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
