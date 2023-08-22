import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { Location } from './location.entity';

@Entity()
export class LocationVendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorId: number;

  @Column()
  locationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // many to one.
  @ManyToOne(() => Vendor, (vendor) => vendor.locationsVendors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  // many to one.
  @ManyToOne(() => Location, (location) => location.locationsVendors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;
}
