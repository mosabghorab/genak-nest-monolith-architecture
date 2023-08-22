import { Expose, Type } from 'class-transformer';
import { AdminStatus } from '../enums/admin-status.enum';
import { AdminsRolesDto } from './admins-roles.dto';

export class AdminDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  status: AdminStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => AdminsRolesDto)
  adminsRoles: AdminsRolesDto[];
}
