import { IsEnum } from 'class-validator';
import { AttachmentStatus } from '../../../../shared/enums/attachment-status.enum';

export class UpdateAttachmentStatusDto {
  @IsEnum(AttachmentStatus)
  status: AttachmentStatus;
}
