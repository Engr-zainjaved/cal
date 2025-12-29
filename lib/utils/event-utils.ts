import { CalendarEvent, EventBarSegment } from '@/lib/types/calendar';
import { parseDateString, getDateRange } from './date-utils';
import { getDay } from 'date-fns';

/**
 * Filter events that occur within a date range
 */
export function filterEventsByDateRange(
  events: CalendarEvent[],
  startDate: string,
  endDate: string
): CalendarEvent[] {
  return events.filter(event => {
    // Event overlaps if: event.start <= range.end AND event.end >= range.start
    return event.startDate <= endDate && event.endDate >= startDate;
  });
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  events.forEach(event => {
    const dates = getDateRange(event.startDate, event.endDate);
    dates.forEach(date => {
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(event);
    });
  });

  return grouped;
}

/**
 * Calculate event bar segments for rendering multi-day events
 * Breaks events into week segments
 */
export function calculateEventSegments(
  event: CalendarEvent,
  weekStartDate: string
): EventBarSegment[] {
  const eventDates = getDateRange(event.startDate, event.endDate);
  const segments: EventBarSegment[] = [];

  let currentSegment: string[] = [];
  let lastDayOfWeek = -1;

  eventDates.forEach((dateString, index) => {
    const date = parseDateString(dateString);
    const dayOfWeek = getDay(date);

    // Start new segment if we've wrapped to a new week
    if (dayOfWeek <= lastDayOfWeek && currentSegment.length > 0) {
      // Save current segment
      const firstDay = parseDateString(currentSegment[0]);
      const lastDay = parseDateString(currentSegment[currentSegment.length - 1]);

      segments.push({
        event,
        startCol: getDay(firstDay) + 1,
        endCol: getDay(lastDay) + 2,
        isFirstSegment: segments.length === 0,
        isLastSegment: false,
      });

      currentSegment = [];
    }

    currentSegment.push(dateString);
    lastDayOfWeek = dayOfWeek;
  });

  // Add final segment
  if (currentSegment.length > 0) {
    const firstDay = parseDateString(currentSegment[0]);
    const lastDay = parseDateString(currentSegment[currentSegment.length - 1]);

    segments.push({
      event,
      startCol: getDay(firstDay) + 1,
      endCol: getDay(lastDay) + 2,
      isFirstSegment: segments.length === 0,
      isLastSegment: true,
    });
  }

  // Mark last segment
  if (segments.length > 0) {
    segments[segments.length - 1].isLastSegment = true;
  }

  return segments;
}

/**
 * Sort events by start date, then by duration (longer first)
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    // If same start date, longer events first
    return b.endDate.localeCompare(a.endDate);
  });
}
