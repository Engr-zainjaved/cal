'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { CalendarToolbar } from './CalendarToolbar';
import { MonthGrid } from './MonthGrid';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { getEventDuration } from '@/lib/utils/date-utils';
import { addDays, format } from 'date-fns';

export function YearCalendar() {
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container mx-auto p-6">
        <CalendarToolbar />
        <MonthGrid year={selectedYear} />
      </div>
    </DndContext>
  );
}
