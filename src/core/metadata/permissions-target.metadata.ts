import { SetMetadata } from '@nestjs/common';
import { PermissionGroup } from '../../modules/admin/enums/permission-group.enum';

export const PERMISSIONS_TARGET_KEY = 'permissionsTarget';

export const PermissionsTarget = (permissionsGroups: PermissionGroup) => SetMetadata(PERMISSIONS_TARGET_KEY, permissionsGroups);
