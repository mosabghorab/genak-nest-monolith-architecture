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
import { CustomerStatus } from '../../customer/enums/customer-status.enum';
import { CustomerAddress } from '../../customer/entities/customer-address.entity';
import { Order } from './order.entity';
import { Location } from './location.entity';
import { Review } from './review.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @Column()
  governorateId: number;

  @Column()
  regionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(
    () => CustomerAddress,
    (customerAddress) => customerAddress.customer,
    { cascade: true },
  )
  customerAddresses: CustomerAddress[];

  @OneToMany(() => Order, (order) => order.customer, { cascade: true })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.order, { cascade: true })
  reviews: Review[];

  // many to one.
  @ManyToOne(() => Location, (location) => location.customersByGovernorate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'governorateId' })
  governorate: Location;

  @ManyToOne(() => Location, (location) => location.customersByRegion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'regionId' })
  region: Location;
}
