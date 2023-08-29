import { DateFilterOption } from '../../modules/admin/enums/date-filter-options.enum';

export abstract class DateHelpers {
  // get today and tomorrow for a date.
  static getTodayAndTomorrowForADate(date: Date): { today: Date; tomorrow: Date } {
    const today: Date = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow: Date = new Date(today);
    tomorrow.setHours(23, 59, 59, 999);
    return { today, tomorrow };
  }

  // get week start and end for a date.
  static getWeekStartAndEndForADate(date: Date): { startOfWeek: Date; endOfWeek: Date } {
    const today: Date = new Date(date);
    const dayOfWeek: number = today.getDay();
    // Calculate the start of the week (Sunday).
    const startOfWeek: Date = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    // Calculate the end of the week (Saturday).
    const endOfWeek: Date = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  }

  // get month start and end for a date.
  static getMonthStartAndEndForADate(date: Date): { startOfMonth: Date; endOfMonth: Date } {
    const today: Date = new Date(date);
    // Calculate the start of the month.
    const startOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    // Calculate the end of the month.
    const nextMonth: Date = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfMonth: Date = new Date(nextMonth.getTime() - 1);
    endOfMonth.setHours(23, 59, 59, 999);
    return { startOfMonth, endOfMonth };
  }

  // get year start and end for a date.
  static getYearStartAndEndForADate(date: Date): { startOfYear: Date; endOfYear: Date } {
    const today: Date = new Date(date);
    // Calculate the start of the year.
    const startOfYear: Date = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    // Calculate the end of the year.
    const endOfYear: Date = new Date(today.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);
    return { startOfYear, endOfYear };
  }

  // get date range for date filter option.
  static getDateRangeForDateFilterOption(dateFilterOption: DateFilterOption): any {
    const now: Date = new Date();
    switch (dateFilterOption) {
      case DateFilterOption.TODAY:
        const { today, tomorrow }: { today: Date; tomorrow: Date } = this.getTodayAndTomorrowForADate(now);
        return {
          startDate: today,
          endDate: tomorrow,
        };
      case DateFilterOption.THIS_WEEK: {
        const { startOfWeek, endOfWeek }: { startOfWeek: Date; endOfWeek: Date } = this.getWeekStartAndEndForADate(now);
        return {
          startDate: startOfWeek,
          endDate: endOfWeek,
        };
      }
      case DateFilterOption.THIS_MONTH: {
        const {
          startOfMonth,
          endOfMonth,
        }: {
          startOfMonth: Date;
          endOfMonth: Date;
        } = this.getMonthStartAndEndForADate(now);
        return {
          startDate: startOfMonth,
          endDate: endOfMonth,
        };
      }
      case DateFilterOption.THIS_YEAR: {
        const { startOfYear, endOfYear }: { startOfYear: Date; endOfYear: Date } = this.getYearStartAndEndForADate(now);
        return {
          startDate: startOfYear,
          endDate: endOfYear,
        };
      }
      default:
        throw new Error('Invalid date filter option.');
    }
  }

  // calculate time difference in minutes.
  static calculateTimeDifferenceInMinutes(startDate: Date, endDate: Date): number {
    const timeDifferenceMs: number = endDate.getTime() - startDate.getTime();
    return Math.floor(timeDifferenceMs / (1000 * 60));
  }
}
