import { Expose, Type } from 'class-transformer';
import { RoleDto } from './role.dto';
import { PermissionDto } from './permission.dto';

export class RolesPermissionsDto {
  @Expose()
  id: number;

  @Expose()
  roleId: number;

  @Expose()
  permissionId: number;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;

  @Expose()
  @Type(() => PermissionDto)
  permission: PermissionDto;
}
