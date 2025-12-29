'use client';

import { TimelineDay } from './TimelineDay';
import { TimelineEvent } from './TimelineEvent';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { MONTH_NAMES } from '@/lib/constants/calendar-constants';
import { getDaysInMonth, isToday, getDay } from 'date-fns';
import { format } from 'date-fns';

interface TimelineMonthProps {
  year: number;
  month: number;
}

const DAY_ABBREV = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function TimelineMonth({ year, month }: TimelineMonthProps) {
  const { getEventsByMonth } = useCalendarEvents();
  const events = getEventsByMonth(year, month);

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const dayOfWeek = getDay(date);
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      dayNumber: i + 1,
      dayOfWeekLetter: DAY_ABBREV[dayOfWeek],
      isToday: isToday(date),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });

  // Filter events that are in this month
  const monthEvents = events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, daysInMonth);

    // Event overlaps if it starts before month ends AND ends after month starts
    return eventStart <= monthEnd && eventEnd >= monthStart;
  });

  // Calculate event positioning relative to this month
  const eventsWithPosition = monthEvents.map((event, index) => {
    const eventStart = new Date(event.startDate);
    const monthStart = new Date(year, month, 1);

    // If event starts before this month, position at day 1
    const startDay = eventStart.getMonth() === month && eventStart.getFullYear() === year
      ? eventStart.getDate()
      : 1;

    // Calculate duration within this month
    const eventEnd = new Date(event.endDate);
    const monthEnd = new Date(year, month, daysInMonth);

    const effectiveStart = eventStart < monthStart ? monthStart : eventStart;
    const effectiveEnd = eventEnd > monthEnd ? monthEnd : eventEnd;

    const duration = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      event,
      startDay,
      duration,
      offset: index * 20 // Stack events vertically
    };
  });

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden h-full flex flex-col">
      {/* Month header */}
      <div className="px-2 py-1 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">
          {MONTH_NAMES[month]}
        </h3>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-hidden p-1">
        <div className="relative h-full">
          {/* Day of week headers */}
          <div className="grid grid-cols-31 gap-px mb-px">
            {days.map((day, i) => (
              <div
                key={i}
                className="text-[6px] text-center text-gray-500 dark:text-gray-400 font-medium"
                style={{ gridColumn: i + 1 }}
              >
                {day.dayOfWeekLetter}
              </div>
            ))}
          </div>

          {/* Days row */}
          <div className="grid grid-cols-31 gap-px">
            {days.map((day, i) => (
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

          {/* Events layer */}
          <div className="absolute left-0 top-5 w-full pointer-events-none" style={{ height: 'calc(100% - 20px)' }}>
            <div className="relative h-full">
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
