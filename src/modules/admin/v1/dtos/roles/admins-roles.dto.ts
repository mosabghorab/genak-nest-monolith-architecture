import { Expose, Type } from 'class-transformer';
import { AdminDto } from '../admins/admin.dto';
import { RoleDto } from './role.dto';

export class AdminsRolesDto {
  @Expose()
  id: number;

  @Expose()
  adminId: number;

  @Expose()
  roleId: number;

  @Expose()
  @Type(() => AdminDto)
  admin: AdminDto;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
