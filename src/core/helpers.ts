import { randomBytes } from 'crypto';
import * as fs from 'fs-extra';
import { PermissionAction } from '../modules/admin/enums/permission-action.enum';
import { PermissionGroup } from '../modules/admin/enums/permission-group.enum';
import { AdminsRoles } from '../modules/admin/entities/admins-roles.entity';
import { DateFilterOption } from '../modules/admin/enums/date-filter-options.enum';

export abstract class Helpers {
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
    action: PermissionAction,
    group: PermissionGroup,
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
    tomorrow.setHours(23, 59, 59, 999);
    return { today, tomorrow };
  };

  static getWeekStartAndEndForADate = (date: Date) => {
    const today = new Date(date);
    const dayOfWeek = today.getDay();

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  static getMonthStartAndEndForADate = (date: Date) => {
    const today = new Date(date);

    // Calculate the start of the month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Calculate the end of the month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfMonth = new Date(nextMonth.getTime() - 1);
    endOfMonth.setHours(23, 59, 59, 999);

    return { startOfMonth, endOfMonth };
  };

  static getYearStartAndEndForADate = (date: Date) => {
    const today = new Date(date);

    // Calculate the start of the year
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    // Calculate the end of the year
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    return { startOfYear, endOfYear };
  };

  static getDateRangeForFilterOption(filterOption: DateFilterOption) {
    const now = new Date();
    switch (filterOption) {
      case DateFilterOption.TODAY:
        const { today, tomorrow } = Helpers.getTodayAndTomorrowForADate(now);
        return {
          startDate: today,
          endDate: tomorrow,
        };
      case DateFilterOption.THIS_WEEK: {
        const { startOfWeek, endOfWeek } =
          Helpers.getWeekStartAndEndForADate(now);
        return {
          startDate: startOfWeek,
          endDate: endOfWeek,
        };
      }
      case DateFilterOption.THIS_MONTH: {
        const { startOfMonth, endOfMonth } =
          Helpers.getMonthStartAndEndForADate(now);
        return {
          startDate: startOfMonth,
          endDate: endOfMonth,
        };
      }
      case DateFilterOption.THIS_YEAR: {
        const { startOfYear, endOfYear } =
          Helpers.getYearStartAndEndForADate(now);
        return {
          startDate: startOfYear,
          endDate: endOfYear,
        };
      }
      default:
        throw new Error('Invalid date filter option');
    }
  }

  static calculateTimeDifferenceInMinutes(
    startDate: Date,
    endDate: Date,
  ): number {
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();
    return Math.floor(timeDifferenceMs / (1000 * 60));
  }
}
