'use client';

import { DayData, CalendarEvent } from '@/lib/types/calendar';
import { DayCell } from './DayCell';
import { EventBar } from './EventBar';
import { DAY_NAMES_SHORT } from '@/lib/constants/calendar-constants';
import { calculateEventSegments } from '@/lib/utils/event-utils';

interface DayGridProps {
  days: DayData[];
  events: CalendarEvent[];
}

export function DayGrid({ days, events }: DayGridProps) {
  // Group days into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-0">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0">
        {DAY_NAMES_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="relative">
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0">
            {week.map((day) => (
              <DayCell key={day.dateString} day={day} />
            ))}
          </div>

          {/* Event bars overlaid on this week */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-7 gap-0 pt-7">
            {events.map((event) => {
              const segments = calculateEventSegments(event, week[0].dateString);
              return segments.map((segment, i) => (
                <div
                  key={`${event.id}-${i}`}
                  className="contents pointer-events-auto"
                >
                  <EventBar segment={segment} />
                </div>
              ));
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
