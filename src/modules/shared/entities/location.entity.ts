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
import { Vendor } from './vendor.entity';
import { LocationVendor } from './location-vendor.entity';
import { Customer } from './customer.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // many to one.
  @ManyToOne(() => Location, (location) => location.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Location;

  // one to many.
  @OneToMany(() => Location, (location) => location.parent, {
    cascade: true,
  })
  locations: Location[];

  @OneToMany(() => Vendor, (vendor) => vendor.governorate, {
    cascade: true,
  })
  vendors: Vendor[];

  @OneToMany(
    () => LocationVendor,
    (locationVendor) => locationVendor.location,
    {
      cascade: true,
    },
  )
  locationsVendors: LocationVendor[];

  @OneToMany(() => Customer, (customer) => customer.governorate, {
    cascade: true,
  })
  customersByGovernorate: Customer[];

  @OneToMany(() => Customer, (customer) => customer.region, {
    cascade: true,
  })
  customersByRegion: Customer[];
}
