import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  differenceInDays,
  getDay,
  getDaysInMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { DayData } from '@/lib/types/calendar';

/**
 * Get all days for a given month, including padding days
 */
export function getMonthDays(year: number, month: number): DayData[] {
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(new Date(year, month));

  // Get padding days from previous month
  const startPadding = getDay(firstDay); // 0-6
  const startDate = addDays(firstDay, -startPadding);

  // Get padding days from next month
  const endPadding = 6 - getDay(lastDay);
  const endDate = addDays(lastDay, endPadding);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map(date => ({
    date,
    dateString: format(date, 'yyyy-MM-dd'),
    dayOfWeek: getDay(date),
    isCurrentMonth: date.getMonth() === month,
    isToday: isToday(date),
    events: [],
  }));
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDateString(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Calculate duration in days between two dates
 */
export function getEventDuration(startDate: string, endDate: string): number {
  return differenceInDays(
    parseDateString(endDate),
    parseDateString(startDate)
  );
}

/**
 * Check if a date falls within a range
 */
export function isDateInRange(
  date: string,
  rangeStart: string,
  rangeEnd: string
): boolean {
  const d = parseDateString(date);
  const start = parseDateString(rangeStart);
  const end = parseDateString(rangeEnd);

  return d >= start && d <= end;
}

/**
 * Get array of dates between start and end (inclusive)
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const days = eachDayOfInterval({
    start: parseDateString(startDate),
    end: parseDateString(endDate),
  });

  return days.map(formatDateString);
}
