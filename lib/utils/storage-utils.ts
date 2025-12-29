import { CalendarStorage } from '@/lib/types/calendar';
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_CATEGORIES } from '@/lib/constants/calendar-constants';
import { nanoid } from 'nanoid';

/**
 * Get initial storage data with defaults
 */
export function getInitialStorage(): CalendarStorage {
  const now = new Date().toISOString();

  return {
    version: STORAGE_VERSION,
    events: [],
    categories: DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    })),
    settings: {
      gridLayout: '3x4',
      defaultView: new Date().getFullYear(),
    },
  };
}

/**
 * Migrate storage data if needed
 */
export function migrateStorage(data: Partial<CalendarStorage>): CalendarStorage {
  // For now, just ensure we have all required fields
  const initial = getInitialStorage();

  return {
    version: STORAGE_VERSION,
    events: data.events || initial.events,
    categories: data.categories || initial.categories,
    settings: data.settings || initial.settings,
  };
}

/**
 * Validate storage data
 */
export function isValidStorage(data: any): data is CalendarStorage {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.events) &&
    Array.isArray(data.categories) &&
    data.settings &&
    typeof data.settings === 'object'
  );
}
