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

  // 4 quarters: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
  const quarters = [0, 3, 6, 9];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen overflow-hidden bg-background">
        <div className="flex flex-col h-full px-4 py-3">
          <CalendarToolbar />

          {/* 4 Quarter Rows - Each showing 3 months continuously */}
          <div className="flex-1 flex flex-col overflow-hidden gap-1">
            {quarters.map((startMonth) => (
              <div key={startMonth} className="flex-1 min-h-0">
                <TimelineQuarter year={selectedYear} startMonth={startMonth} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
