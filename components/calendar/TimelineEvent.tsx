'use client';

import { CalendarEvent } from '@/lib/types/calendar';
import { useCategories } from '@/hooks/useCategories';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface TimelineEventProps {
  event: CalendarEvent;
  startDay: number;
  duration: number;
  offset: number;
}

export function TimelineEvent({ event, startDay, duration, offset }: TimelineEventProps) {
  const { getCategoryById } = useCategories();
  const openEventModal = useCalendarStore((state) => state.openEventModal);

  const category = getCategoryById(event.categoryId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  });

  const style = {
    backgroundColor: category?.color || '#6B7280',
    gridColumn: `${startDay} / span ${duration}`,
    top: `${offset}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'absolute h-4 rounded-sm px-1 text-white cursor-pointer hover:brightness-110 transition-all z-10 flex items-center overflow-hidden pointer-events-auto'
      )}
      onClick={() => openEventModal(event)}
      {...listeners}
      {...attributes}
    >
      <span className="truncate text-[6px] font-medium leading-none">{event.title}</span>
    </div>
  );
}
