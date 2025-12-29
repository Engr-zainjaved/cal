'use client';

import { TimelineDay } from './TimelineDay';
import { TimelineEvent } from './TimelineEvent';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { MONTH_NAMES_SHORT } from '@/lib/constants/calendar-constants';
import { getDaysInMonth, isToday, getDay } from 'date-fns';
import { format } from 'date-fns';

interface TimelineQuarterProps {
  year: number;
  startMonth: number;
  monthCount: number; // Number of months to display in this row
}

export function TimelineQuarter({ year, startMonth, monthCount }: TimelineQuarterProps) {
  const { getEventsByDateRange } = useCalendarEvents();

  // Get all months in this row
  const months = Array.from({ length: monthCount }, (_, i) => startMonth + i);

  // Calculate all days across the months
  const allDays: Array<{
    date: Date;
    dateString: string;
    dayNumber: number;
    month: number;
    isToday: boolean;
    isWeekend: boolean;
    dayOfWeek: number;
  }> = [];

  let cumulativeDayIndex = 0;
  const monthStartIndices: number[] = [];

  months.forEach((month) => {
    monthStartIndices.push(cumulativeDayIndex);
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(year, month, i + 1);
      const dayOfWeek = getDay(date);
      allDays.push({
        date,
        dateString: format(date, 'yyyy-MM-dd'),
        dayNumber: i + 1,
        month,
        isToday: isToday(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        dayOfWeek,
      });
      cumulativeDayIndex++;
    }
  });

  // Get events for this row
  const lastMonth = startMonth + monthCount - 1;
  const rowStart = format(new Date(year, startMonth, 1), 'yyyy-MM-dd');
  const rowEnd = format(
    new Date(year, lastMonth, getDaysInMonth(new Date(year, lastMonth))),
    'yyyy-MM-dd'
  );
  const events = getEventsByDateRange(rowStart, rowEnd);

  // Calculate event positioning across the entire quarter
  const eventsWithPosition = events.map((event, index) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    // Find which day index the event starts at
    let startDayIndex = 0;
    let duration = 0;

    for (let i = 0; i < allDays.length; i++) {
      const dayDate = allDays[i].date;
      if (format(dayDate, 'yyyy-MM-dd') === event.startDate) {
        startDayIndex = i;
      }
      if (
        format(dayDate, 'yyyy-MM-dd') >= event.startDate &&
        format(dayDate, 'yyyy-MM-dd') <= event.endDate
      ) {
        duration++;
      }
    }

    return {
      event,
      startDay: startDayIndex + 1, // grid-column is 1-based
      duration: Math.max(duration, 1),
      offset: index * 18, // Stack events vertically
    };
  });

  const totalDays = allDays.length;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3 px-2">
      <div className="relative">
        {/* Month labels row */}
        <div className="flex mb-1" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
          {months.map((month, idx) => {
            const daysInMonth = getDaysInMonth(new Date(year, month));
            const widthPercent = (daysInMonth / totalDays) * 100;
            return (
              <div
                key={month}
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-left"
                style={{ width: `${widthPercent}%` }}
              >
                {MONTH_NAMES_SHORT[month]}
              </div>
            );
          })}
        </div>

        {/* Day of week headers - only show S S for weekends */}
        <div
          className="grid mb-1"
          style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
        >
          {allDays.map((day, i) => (
            <div
              key={i}
              className="text-[6px] text-center text-gray-500 dark:text-gray-400 font-medium h-2"
            >
              {day.isWeekend ? 'S' : ''}
            </div>
          ))}
        </div>

        {/* Days and Events container */}
        <div className="relative">
          {/* Days row */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
          >
            {allDays.map((day, i) => (
              <TimelineDay
                key={day.dateString}
                date={day.date}
                dateString={day.dateString}
                dayNumber={day.dayNumber}
                isToday={day.isToday}
                isWeekend={day.isWeekend}
                columnIndex={i}
              />
            ))}
          </div>

          {/* Events layer - positioned absolutely over the days */}
          <div
            className="absolute left-0 top-4 w-full pointer-events-none"
            style={{ minHeight: '60px' }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))`,
              }}
            >
              {eventsWithPosition.map(({ event, startDay, duration, offset }) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  startDay={startDay}
                  duration={duration}
                  offset={offset}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
