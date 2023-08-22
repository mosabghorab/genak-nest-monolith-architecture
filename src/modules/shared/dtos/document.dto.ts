import { Expose, Type } from 'class-transformer';
import { DocumentType } from '../enums/document-type.enum';
import { ServiceType } from '../enums/service-type.enum';
import { AttachmentDto } from './attachment.dto';

export class DocumentDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: DocumentType;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  required: boolean;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}
