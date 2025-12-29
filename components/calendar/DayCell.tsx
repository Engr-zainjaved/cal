'use client';

import { DayData } from '@/lib/types/calendar';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DayCellProps {
  day: DayData;
}

export function DayCell({ day }: DayCellProps) {
  const openEventModal = useCalendarStore((state) => state.openEventModal);

  const { setNodeRef, isOver } = useDroppable({
    id: day.dateString,
    data: { date: day.dateString },
  });

  const handleClick = () => {
    openEventModal({
      id: '',
      title: '',
      startDate: day.dateString,
      endDate: day.dateString,
      categoryId: '',
      createdAt: '',
      updatedAt: '',
    } as any);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-20 p-1 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        !day.isCurrentMonth && 'bg-gray-100 dark:bg-gray-900 text-gray-400',
        day.isToday && 'ring-2 ring-blue-500',
        isOver && 'bg-blue-50 dark:bg-blue-900/20'
      )}
      onClick={handleClick}
    >
      <div className="text-sm font-medium">
        {day.date.getDate()}
      </div>
    </div>
  );
}
