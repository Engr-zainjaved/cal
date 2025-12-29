'use client';

import { useCalendarStore } from '@/lib/store/calendar-store';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface TimelineDayProps {
  date: Date;
  dateString: string;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  columnIndex: number;
}

export function TimelineDay({ date, dateString, dayNumber, isToday, isWeekend, columnIndex }: TimelineDayProps) {
  const openEventModal = useCalendarStore((state) => state.openEventModal);

  const { setNodeRef, isOver } = useDroppable({
    id: dateString,
    data: { date: dateString },
  });

  const handleClick = () => {
    openEventModal({
      id: '',
      title: '',
      startDate: dateString,
      endDate: dateString,
      categoryId: '',
      createdAt: '',
      updatedAt: '',
    } as any);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[7px] font-medium h-3',
        isToday && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold',
        isWeekend && 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 dark:text-gray-500',
        !isToday && !isWeekend && 'text-gray-700 dark:text-gray-300',
        isOver && 'bg-blue-100 dark:bg-blue-800/30'
      )}
      onClick={handleClick}
      title={dateString}
      style={{ gridColumn: columnIndex + 1 }}
    >
      {dayNumber}
    </div>
  );
}
