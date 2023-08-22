import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity()
export class Reason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(
    () => OrderStatusHistory,
    (orderStatusHistory) => orderStatusHistory.reason,
    {
      cascade: true,
    },
  )
  orderStatusHistories: OrderStatusHistory[];
}
