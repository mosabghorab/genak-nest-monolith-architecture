import { randomBytes } from 'crypto';
import * as fs from 'fs-extra';
import { PermissionAction } from '../../modules/admin/enums/permission-action.enum';
import { PermissionGroup } from '../../modules/admin/enums/permission-group.enum';
import { AdminsRoles } from '../../modules/admin/entities/admins-roles.entity';
import { RolesPermissions } from '../../modules/admin/entities/roles-permissions.entity';

export abstract class Helpers {
  // extract token from header.
  static extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  // generate unique file name.
  static generateUniqueFileName(originalName: string): string {
    const timestamp: number = Date.now();
    const randomString: string = randomBytes(8).toString('hex');
    const fileExtension: string = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${fileExtension}`;
  }

  // save file.
  static async saveFile(filepath: string, filename: string, file: any): Promise<void> {
    await fs.ensureDir(filepath);
    await file.mv(filepath + filename);
  }

  // admin can do (for checking if admin can do a specific action on specific target).
  static adminCanDo(action: PermissionAction, group: PermissionGroup, adminsRoles: AdminsRoles[]) {
    return adminsRoles.some((e: AdminsRoles) => e.role.rolesPermissions.some((p: RolesPermissions) => p.permission.action === action && p.permission.group === group));
  }
}
