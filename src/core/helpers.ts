import { randomBytes } from 'crypto';
import * as fs from 'fs-extra';
import { PermissionsActions } from '../modules/admin/enums/permissions-actions.enum';
import { PermissionsGroups } from '../modules/admin/enums/permissions-groups.enum';
import { AdminsRoles } from '../modules/admin/entities/admins-roles.entity';
import { SelectQueryBuilder } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';

export abstract class Helpers {
  static getDateAndTomorrowB;

  static extractTokenFromHeader = (request: Request): string | undefined => {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };

  static generateUniqueFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString('hex');
    const fileExtension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${fileExtension}`;
  };

  static saveFile = async (
    filepath: string,
    filename: string,
    file: any,
  ): Promise<boolean> => {
    await fs.ensureDir(filepath);
    await file.mv(filepath + filename);
    return true;
  };

  static can = (
    action: PermissionsActions,
    group: PermissionsGroups,
    adminsRoles: AdminsRoles[],
  ) => {
    return adminsRoles.some((e) =>
      e.role.rolesPermissions.some(
        (p) => p.permission.action === action && p.permission.group === group,
      ),
    );
  };

  static getTodayAndTomorrowForADate = (date: Date) => {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { today, tomorrow };
  };

  // prepare query builder relations.
  static buildRelationsForQueryBuilder = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    relations: FindOptionsRelations<T>,
    alias: string,
  ) => {
    for (const relation of Object.keys(relations)) {
      queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
      if (typeof relations[relation] !== 'boolean') {
        Helpers.buildRelationsForQueryBuilder(
          queryBuilder,
          relations[relation],
          relation,
        );
      }
    }
  };
}
