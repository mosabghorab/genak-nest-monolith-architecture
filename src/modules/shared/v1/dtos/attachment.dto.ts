import { Expose, Type } from 'class-transformer';
import { AttachmentStatus } from '../../enums/attachment-status.enum';
import { VendorDto } from './vendor.dto';
import { DocumentDto } from './document.dto';

export class AttachmentDto {
  @Expose()
  id: number;

  @Expose()
  documentId: number;

  @Expose()
  vendorId: number;

  @Expose()
  file: string;

  @Expose()
  status: AttachmentStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => DocumentDto)
  document: DocumentDto;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;
}
