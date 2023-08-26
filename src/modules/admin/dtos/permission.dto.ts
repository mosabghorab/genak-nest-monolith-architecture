import { Expose, Type } from 'class-transformer';
import { PermissionAction } from '../enums/permission-action.enum';
import { PermissionGroup } from '../enums/permission-group.enum';
import { RolesPermissionsDto } from './roles-permissions.dto';

export class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  action: PermissionAction;

  @Expose()
  group: PermissionGroup;

  @Expose()
  @Type(() => RolesPermissionsDto)
  rolesPermissions: RolesPermissionsDto[];
}
