import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VendorStatus } from '../../vendor/enums/vendor-status.enum';
import { ServiceType } from '../enums/service-type.enum';
import { Location } from './location.entity';
import { LocationVendor } from './location-vendor.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Attachment } from './attachment.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  commercialName: string;

  @Column({ type: 'enum', enum: ServiceType })
  serviceType: ServiceType;

  @Column()
  governorateId: number;

  @Column({ type: 'numeric', nullable: true })
  lat?: number;

  @Column({ type: 'numeric', nullable: true })
  lng?: number;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  maxProducts: number;

  @Column({ nullable: true })
  maxOrders?: number;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({ default: false })
  available: boolean;

  @Column({
    type: 'enum',
    enum: VendorStatus,
    default: VendorStatus.DOCUMENTS_REQUIRED,
  })
  status: VendorStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // many to one.
  @ManyToOne(() => Location, (location) => location.vendors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'governorateId' })
  governorate: Location;

  // one to many.
  @OneToMany(() => LocationVendor, (locationVendor) => locationVendor.vendor, {
    cascade: true,
  })
  locationsVendors: LocationVendor[];

  @OneToMany(() => Order, (order) => order.vendor, { cascade: true })
  orders: Order[];

  @OneToMany(() => Review, (review) => review.vendor, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Attachment, (attachment) => attachment.vendor, {
    cascade: true,
  })
  attachments: Attachment[];
}
