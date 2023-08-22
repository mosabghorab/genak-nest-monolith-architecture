import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttachmentStatus } from '../enums/attachment-status.enum';
import { Document } from './document.entity';
import { Vendor } from './vendor.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @Column()
  vendorId: number;

  @Column()
  file: string;

  @Column({
    type: 'enum',
    enum: AttachmentStatus,
    default: AttachmentStatus.PENDING,
  })
  status: AttachmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // many to one.
  @ManyToOne(() => Document, (document) => document.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @ManyToOne(() => Vendor, (vendor) => vendor.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}
