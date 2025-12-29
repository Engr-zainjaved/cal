import { useCalendarStore } from '@/lib/store/calendar-store';
import { CalendarEvent } from '@/lib/types/calendar';

export function useCalendarEvents() {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByMonth,
    getEventsByDateRange,
  } = useCalendarStore();

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByMonth,
    getEventsByDateRange,
  };
}
