import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../shared/entities/customer.entity';
import { Order } from '../../shared/entities/order.entity';

@Entity()
export class CustomerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  onMapName: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'double' })
  lat: number;

  @Column({ type: 'double' })
  lng: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  @ManyToOne(() => Customer, (customer) => customer.customerAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  // one to many.
  @OneToMany(() => Order, (order) => order.customerAddress, { cascade: true })
  orders: Order[];
}
