import { AdminsRoles } from '../../modules/admin/entities/admins-roles.entity';
import { UserType } from '../../modules/shared/enums/user-type.enum';

export type AuthedUser = {
  id: number;
  type: UserType;
  adminsRoles?: AdminsRoles[];
};
