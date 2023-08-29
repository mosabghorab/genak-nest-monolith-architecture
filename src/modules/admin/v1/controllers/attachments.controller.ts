import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { UserType } from '../../../shared/enums/user-type.enum';
import { AllowFor } from '../../../../core/metadata/allow-for.metadata';
import { Serialize } from '../../../../core/interceptors/serialize.interceptor';
import { AdminMustCanDo } from '../../../../core/metadata/admin-must-can-do.metadata';
import { PermissionAction } from '../../enums/permission-action.enum';
import { PermissionsTarget } from '../../../../core/metadata/permissions-target.metadata';
import { PermissionGroup } from '../../enums/permission-group.enum';
import { AttachmentsService } from '../services/attachments.service';
import { AttachmentDto } from '../../../shared/v1/dtos/attachment.dto';
import { UpdateAttachmentStatusDto } from '../dtos/attachments/update-attachment-status.dto';
import { Attachment } from '../../../shared/entities/attachment.entity';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ATTACHMENTS)
@Controller({ path: 'admin/attachments', version: '1' })
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AttachmentDto, 'Attachment status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@Param('id') id: number, @Body() updateAttachmentStatusDto: UpdateAttachmentStatusDto): Promise<Attachment> {
    return this.attachmentsService.updateStatus(id, updateAttachmentStatusDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AttachmentDto, 'Attachment deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Attachment> {
    return this.attachmentsService.removeOneById(id);
  }
}
