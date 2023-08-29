import { Expose, Type } from 'class-transformer';
import { RolesPermissionsDto } from './roles-permissions.dto';
import { AdminsRolesDto } from './admins-roles.dto';

export class RoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => RolesPermissionsDto)
  rolesPermissions: RolesPermissionsDto[];

  @Expose()
  @Type(() => AdminsRolesDto)
  usersRoles: AdminsRolesDto[];
}
