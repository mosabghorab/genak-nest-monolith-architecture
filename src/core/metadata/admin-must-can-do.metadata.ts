import { SetMetadata } from '@nestjs/common';
import { PermissionsActions } from '../../modules/admin/enums/permissions-actions.enum';

export const ADMIN_MUST_CAN_DO_KEY = 'adminMustCanDo';

export const AdminMustCanDo = (permissionsActions: PermissionsActions) =>
  SetMetadata(ADMIN_MUST_CAN_DO_KEY, permissionsActions);
