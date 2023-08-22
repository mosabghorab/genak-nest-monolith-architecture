import { Expose, Type } from 'class-transformer';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { RolesPermissionsDto } from './roles-permissions.dto';

export class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  action: PermissionsActions;

  @Expose()
  group: PermissionsGroups;

  @Expose()
  @Type(() => RolesPermissionsDto)
  rolesPermissions: RolesPermissionsDto[];
}
