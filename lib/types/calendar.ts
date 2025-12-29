// Event type
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;             // YYYY-MM-DD format
  endDate: string;               // YYYY-MM-DD format
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  color: string;                 // Hex color
  createdAt: string;
  updatedAt: string;
}

// Local storage schema
export interface CalendarStorage {
  version: string;
  events: CalendarEvent[];
  categories: Category[];
  settings: {
    gridLayout: '3x4' | '4x3';
    defaultView: number;         // Year
  };
}

// Store state type
export interface CalendarStore {
  // State
  events: CalendarEvent[];
  categories: Category[];
  selectedYear: number;
  gridLayout: '3x4' | '4x3';
  monthsPerRow: number;
  isEventModalOpen: boolean;
  isCategoryManagerOpen: boolean;
  editingEvent: CalendarEvent | null;

  // Event actions
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // UI actions
  setSelectedYear: (year: number) => void;
  setGridLayout: (layout: '3x4' | '4x3') => void;
  setMonthsPerRow: (months: number) => void;
  openEventModal: (event?: CalendarEvent) => void;
  closeEventModal: () => void;
  openCategoryManager: () => void;
  closeCategoryManager: () => void;

  // Selectors
  getEventsByMonth: (year: number, month: number) => CalendarEvent[];
  getEventsByDateRange: (startDate: string, endDate: string) => CalendarEvent[];
  getCategoryById: (id: string) => Category | undefined;
}

// Day cell data
export interface DayData {
  date: Date;
  dateString: string;            // YYYY-MM-DD
  dayOfWeek: number;             // 0-6 (Sunday-Saturday)
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

// Event bar segment (for multi-day rendering)
export interface EventBarSegment {
  event: CalendarEvent;
  startCol: number;              // 1-7 (grid column start)
  endCol: number;                // 2-8 (grid column end)
  isFirstSegment: boolean;
  isLastSegment: boolean;
}
