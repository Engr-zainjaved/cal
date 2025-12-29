'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { CalendarToolbar } from './CalendarToolbar';
import { TimelineQuarter } from './TimelineQuarter';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { getEventDuration } from '@/lib/utils/date-utils';
import { addDays, format } from 'date-fns';

export function YearTimeline() {
  const selectedYear = useCalendarStore((state) => state.selectedYear);
  const monthsPerRow = useCalendarStore((state) => state.monthsPerRow);
  const { updateEvent } = useCalendarEvents();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const eventId = active.id as string;
    const newStartDate = over.id as string;
    const draggedEvent = active.data.current?.event;

    if (!draggedEvent) return;

    // Calculate duration
    const duration = getEventDuration(
      draggedEvent.startDate,
      draggedEvent.endDate
    );

    // Calculate new end date
    const newEndDate = format(
      addDays(new Date(newStartDate), duration),
      'yyyy-MM-dd'
    );

    // Update event
    updateEvent(eventId, {
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  // Calculate rows dynamically based on monthsPerRow
  const numRows = Math.ceil(12 / monthsPerRow);
  const rows = Array.from({ length: numRows }, (_, i) => i * monthsPerRow);

  // Calculate how many months each row should display
  const getMonthCountForRow = (rowIndex: number) => {
    const startMonth = rows[rowIndex];
    const remainingMonths = 12 - startMonth;
    return Math.min(monthsPerRow, remainingMonths);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen overflow-hidden bg-background">
        <div className="flex flex-col h-full px-4 py-3">
          <CalendarToolbar />

          {/* Dynamic rows based on monthsPerRow setting */}
          <div className="flex-1 flex flex-col overflow-hidden gap-1">
            {rows.map((startMonth, index) => (
              <div key={startMonth} className="flex-1 min-h-0">
                <TimelineQuarter
                  year={selectedYear}
                  startMonth={startMonth}
                  monthCount={getMonthCountForRow(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
