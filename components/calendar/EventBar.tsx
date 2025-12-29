'use client';

import { CalendarEvent, EventBarSegment } from '@/lib/types/calendar';
import { useCategories } from '@/hooks/useCategories';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useDraggable } from '@dnd-kit/core';

interface EventBarProps {
  segment: EventBarSegment;
}

export function EventBar({ segment }: EventBarProps) {
  const { event, startCol, endCol, isFirstSegment, isLastSegment } = segment;
  const { getCategoryById } = useCategories();
  const openEventModal = useCalendarStore((state) => state.openEventModal);

  const category = getCategoryById(event.categoryId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  });

  const style = {
    gridColumnStart: startCol,
    gridColumnEnd: endCol,
    backgroundColor: category?.color || '#6B7280',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative h-6 px-2 py-0.5 text-xs text-white rounded cursor-pointer hover:brightness-110 transition-all z-10"
      onClick={() => openEventModal(event)}
      {...listeners}
      {...attributes}
    >
      {isFirstSegment && (
        <span className="truncate block">{event.title}</span>
      )}
      {!isFirstSegment && !isLastSegment && (
        <span className="truncate block">...</span>
      )}
    </div>
  );
}
