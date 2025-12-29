'use client';

import { MonthHeader } from './MonthHeader';
import { DayGrid } from './DayGrid';
import { getMonthDays } from '@/lib/utils/date-utils';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

interface MonthCardProps {
  year: number;
  month: number;
}

export function MonthCard({ year, month }: MonthCardProps) {
  const { getEventsByMonth } = useCalendarEvents();
  const days = getMonthDays(year, month);
  const events = getEventsByMonth(year, month);

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
      <MonthHeader month={month} year={year} />
      <DayGrid days={days} events={events} />
    </div>
  );
}
