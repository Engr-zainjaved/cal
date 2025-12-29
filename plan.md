# Linear Yearly Calendar Web App - Implementation Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Requirements](#requirements)
3. [Tech Stack](#tech-stack)
4. [Data Models](#data-models)
5. [Architecture Overview](#architecture-overview)
6. [Phase 1: Project Setup](#phase-1-project-setup)
7. [Phase 2: Core Foundation](#phase-2-core-foundation)
8. [Phase 3: Base UI Components](#phase-3-base-ui-components)
9. [Phase 4: Calendar Components](#phase-4-calendar-components)
10. [Phase 5: Modals & Forms](#phase-5-modals--forms)
11. [Phase 6: Drag & Drop](#phase-6-drag--drop)
12. [Phase 7: Integration & Styling](#phase-7-integration--styling)
13. [Phase 8: Testing & Polish](#phase-8-testing--polish)
14. [Resources](#resources)

---

## Project Overview

Build a single-page linear yearly calendar web app that displays all 12 months in a grid layout, allowing users to view their entire year at a glance and manage events/projects with drag-and-drop functionality.

### Key Features
- 📅 Full year view in 3x4 grid layout
- ✏️ Add/edit/delete events with multi-day spans
- 🎨 Color-coded event categories
- 🖱️ Drag & drop event rescheduling
- 💾 Local storage persistence (backend-ready architecture)
- 📱 Responsive design (desktop/tablet/mobile)
- 🌓 Dark mode support

---

## Requirements

### Layout
- **Desktop (>1024px)**: 3×4 grid showing all 12 months
- **Tablet (768-1024px)**: 2×6 grid
- **Mobile (<768px)**: 1×12 grid (stacked)

### Storage
- **MVP**: Local storage for demo/testing
- **Future**: NestJS backend (separate repository)

### User Model
- Single-user application (no authentication for MVP)

### Core Features
1. **Event Management**
   - Create/edit/delete events
   - Multi-day event spans (visual bars across days)
   - Event details: title, description, dates, category, notes

2. **Category Management**
   - Create/edit/delete categories
   - Color coding for visual organization
   - Default categories: Work, Personal, Important, Other

3. **Interactions**
   - Drag and drop to reschedule events
   - Click day to add event
   - Click event to edit
   - Visual feedback for all interactions

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | Framework | 16.1.1 (App Router) |
| React | UI Library | 19.2.3 |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 4.x |
| **shadcn/ui** | **UI Components** | **latest** |
| Radix UI | Headless UI Primitives | via shadcn/ui |
| Zustand | State Management | ^5.0.2 |
| date-fns | Date Handling | ^4.1.0 |
| @dnd-kit/core | Drag & Drop | ^6.3.1 |
| @dnd-kit/utilities | Drag & Drop Utilities | ^3.2.2 |
| react-colorful | Color Picker | ^5.6.1 |
| nanoid | ID Generation | ^5.0.8 |

### Why shadcn/ui?

**shadcn/ui** provides production-ready, accessible UI components:
- ✅ **Copy-paste, not installed**: Components live in your codebase (you own them)
- ✅ **Built on Radix UI**: Excellent accessibility out of the box
- ✅ **Fully customizable**: Modify as needed since they're in your project
- ✅ **TypeScript-first**: Complete type safety
- ✅ **Tailwind-based**: Consistent with our styling approach
- ✅ **Zero runtime overhead**: No library bundle, just your components

**Components from shadcn/ui**: Dialog, Button, Input, Select, Popover, Label

**Custom components**: All calendar-specific (MonthGrid, DayCell, EventBar, etc.)

---

## Data Models

### CalendarEvent
```typescript
interface CalendarEvent {
  id: string;                    // Unique identifier (nanoid)
  title: string;                 // Event title
  description?: string;          // Optional description
  startDate: string;             // ISO 8601 date (YYYY-MM-DD)
  endDate: string;               // ISO 8601 date (YYYY-MM-DD)
  categoryId: string;            // Reference to category
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  notes?: string;                // Optional notes
}
```

### Category
```typescript
interface Category {
  id: string;                    // Unique identifier (nanoid)
  name: string;                  // Category name
  color: string;                 // Hex color code (e.g., "#3B82F6")
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

### Local Storage Schema
```typescript
interface CalendarStorage {
  version: string;               // Schema version (for migrations)
  events: CalendarEvent[];       // All events
  categories: Category[];        // All categories
  settings: {
    gridLayout: '3x4' | '4x3';   // Grid layout preference
    defaultView: number;         // Default year to show
  };
}
```

**Storage Key**: `linear-calendar-data`

**Default Categories**:
1. Work - #3B82F6 (blue)
2. Personal - #10B981 (green)
3. Important - #EF4444 (red)
4. Other - #6B7280 (gray)

---

## Architecture Overview

### Component Hierarchy

```
app/page.tsx (Server Component)
└── YearCalendar (Client Component) [wrapped with DndContext]
    ├── CalendarToolbar (Client Component)
    │   ├── Year selector (previous/next buttons)
    │   ├── Add Event button
    │   └── Settings button (category management)
    │
    ├── MonthGrid (Client Component)
    │   └── MonthCard (×12) (Client Component)
    │       ├── MonthHeader (month name)
    │       └── DayGrid
    │           └── DayCell (×35-42 per month)
    │               └── EventBar (0-n per day)
    │
    ├── EventModal (Client Component)
    ├── CategoryManager (Client Component)
    └── ConfirmDialog (Client Component)
```

### File Structure

```
e:\temp\cal\
├── app/
│   ├── page.tsx                 [REPLACE]
│   ├── layout.tsx               [UPDATE metadata]
│   └── globals.css              [EXTEND styles]
│
├── components/
│   ├── calendar/
│   │   ├── YearCalendar.tsx     [CREATE]
│   │   ├── CalendarToolbar.tsx  [CREATE]
│   │   ├── MonthGrid.tsx        [CREATE]
│   │   ├── MonthCard.tsx        [CREATE]
│   │   ├── MonthHeader.tsx      [CREATE]
│   │   ├── DayGrid.tsx          [CREATE]
│   │   ├── DayCell.tsx          [CREATE]
│   │   └── EventBar.tsx         [CREATE]
│   │
│   ├── modals/
│   │   ├── EventModal.tsx       [CREATE]
│   │   └── CategoryManager.tsx  [CREATE]
│   │
│   └── ui/
│       ├── button.tsx           [SHADCN]
│       ├── dialog.tsx           [SHADCN]
│       ├── input.tsx            [SHADCN]
│       ├── label.tsx            [SHADCN]
│       ├── select.tsx           [SHADCN]
│       ├── popover.tsx          [SHADCN]
│       ├── ColorPicker.tsx      [CREATE]
│       └── ConfirmDialog.tsx    [CREATE]
│
├── lib/
│   ├── store/
│   │   └── calendar-store.ts    [CREATE]
│   ├── types/
│   │   └── calendar.ts          [CREATE]
│   ├── utils/
│   │   ├── date-utils.ts        [CREATE]
│   │   ├── event-utils.ts       [CREATE]
│   │   └── storage-utils.ts     [CREATE]
│   └── constants/
│       └── calendar-constants.ts [CREATE]
│
├── hooks/
│   ├── useCalendarEvents.ts     [CREATE]
│   └── useCategories.ts         [CREATE]
│
└── package.json                 [UPDATE]
```

---

## Phase 1: Project Setup

### Objectives
- Initialize shadcn/ui
- Install all dependencies
- Configure project structure

### Steps

#### Step 1.1: Initialize shadcn/ui
```bash
npx shadcn@latest init
```

**Configuration options when prompted**:
- **Would you like to use TypeScript?** → Yes
- **Which style would you like to use?** → Default
- **Which color would you like to use as base color?** → Slate
- **Where is your global CSS file?** → app/globals.css
- **Would you like to use CSS variables for colors?** → Yes
- **Where is your tailwind.config.ts located?** → tailwind.config.ts (or detect automatically)
- **Configure the import alias for components** → @/components
- **Configure the import alias for utils** → @/lib/utils

This will create:
- `lib/utils.ts` (cn utility for merging classes)
- `components.json` (shadcn config)
- Update your tailwind.config

#### Step 1.2: Install shadcn/ui Components
```bash
npx shadcn@latest add button dialog input label select popover
```

This will add to `components/ui/`:
- `button.tsx`
- `dialog.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `popover.tsx`

#### Step 1.3: Install Additional Dependencies
```bash
npm install zustand date-fns @dnd-kit/core @dnd-kit/utilities react-colorful nanoid
```

#### Step 1.4: Verify Installation

After installation, your `package.json` should include:
```json
{
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "zustand": "^5.0.2",
    "date-fns": "^4.1.0",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/utilities": "^3.2.2",
    "react-colorful": "^5.6.1",
    "nanoid": "^5.0.8",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-popover": "^1.x",
    "@radix-ui/react-select": "^2.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### Deliverables
- ✅ shadcn/ui initialized and configured
- ✅ All base UI components installed in `components/ui/`
- ✅ All dependencies installed
- ✅ `lib/utils.ts` created with `cn` utility

---

## Phase 2: Core Foundation

### Objectives
- Define TypeScript types
- Create constants
- Implement Zustand store with local storage
- Build utility functions
- Create custom hooks

### Step 2.1: Create Type Definitions

**File**: `lib/types/calendar.ts`

```typescript
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
```

### Step 2.2: Create Constants

**File**: `lib/constants/calendar-constants.ts`

```typescript
import { Category } from '@/lib/types/calendar';

// Default categories created on first load
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Work', color: '#3B82F6' },
  { name: 'Personal', color: '#10B981' },
  { name: 'Important', color: '#EF4444' },
  { name: 'Other', color: '#6B7280' },
];

// Month names
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Short month names
export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Day names
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Day names (single letter)
export const DAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Storage key for local storage
export const STORAGE_KEY = 'linear-calendar-data';

// Current storage version (for migrations)
export const STORAGE_VERSION = '1.0.0';

// Color palette for category selection
export const COLOR_PALETTE = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#10B981', // green
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
  '#6B7280', // gray
];
```

### Step 2.3: Create Utility Functions

**File**: `lib/utils/date-utils.ts`

```typescript
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  differenceInDays,
  getDay,
  getDaysInMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { DayData } from '@/lib/types/calendar';

/**
 * Get all days for a given month, including padding days
 */
export function getMonthDays(year: number, month: number): DayData[] {
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(new Date(year, month));

  // Get padding days from previous month
  const startPadding = getDay(firstDay); // 0-6
  const startDate = addDays(firstDay, -startPadding);

  // Get padding days from next month
  const endPadding = 6 - getDay(lastDay);
  const endDate = addDays(lastDay, endPadding);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map(date => ({
    date,
    dateString: format(date, 'yyyy-MM-dd'),
    dayOfWeek: getDay(date),
    isCurrentMonth: date.getMonth() === month,
    isToday: isToday(date),
    events: [],
  }));
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDateString(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Calculate duration in days between two dates
 */
export function getEventDuration(startDate: string, endDate: string): number {
  return differenceInDays(
    parseDateString(endDate),
    parseDateString(startDate)
  );
}

/**
 * Check if a date falls within a range
 */
export function isDateInRange(
  date: string,
  rangeStart: string,
  rangeEnd: string
): boolean {
  const d = parseDateString(date);
  const start = parseDateString(rangeStart);
  const end = parseDateString(rangeEnd);

  return d >= start && d <= end;
}

/**
 * Get array of dates between start and end (inclusive)
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const days = eachDayOfInterval({
    start: parseDateString(startDate),
    end: parseDateString(endDate),
  });

  return days.map(formatDateString);
}
```

**File**: `lib/utils/event-utils.ts`

```typescript
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
```

**File**: `lib/utils/storage-utils.ts`

```typescript
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
```

### Step 2.4: Implement Zustand Store

**File**: `lib/store/calendar-store.ts`

```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { CalendarEvent, Category, CalendarStore } from '@/lib/types/calendar';
import { filterEventsByDateRange } from '@/lib/utils/event-utils';
import { getInitialStorage, migrateStorage, isValidStorage } from '@/lib/utils/storage-utils';
import { STORAGE_KEY } from '@/lib/constants/calendar-constants';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      categories: [],
      selectedYear: new Date().getFullYear(),
      gridLayout: '3x4',
      isEventModalOpen: false,
      isCategoryManagerOpen: false,
      editingEvent: null,

      // Event actions
      addEvent: (eventData) => {
        const now = new Date().toISOString();
        const event: CalendarEvent = {
          ...eventData,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          events: [...state.events, event],
        }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, ...updates, updatedAt: new Date().toISOString() }
              : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      // Category actions
      addCategory: (categoryData) => {
        const now = new Date().toISOString();
        const category: Category = {
          ...categoryData,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates, updatedAt: new Date().toISOString() }
              : category
          ),
        }));
      },

      deleteCategory: (id) => {
        // Find default "Other" category
        const state = get();
        const otherCategory = state.categories.find(cat => cat.name === 'Other');

        if (!otherCategory) {
          console.error('Cannot delete category: "Other" category not found');
          return;
        }

        // Reassign events from deleted category to "Other"
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          events: state.events.map((event) =>
            event.categoryId === id
              ? { ...event, categoryId: otherCategory.id, updatedAt: new Date().toISOString() }
              : event
          ),
        }));
      },

      // UI actions
      setSelectedYear: (year) => set({ selectedYear: year }),

      setGridLayout: (layout) => set({ gridLayout: layout }),

      openEventModal: (event) => set({
        isEventModalOpen: true,
        editingEvent: event || null,
      }),

      closeEventModal: () => set({
        isEventModalOpen: false,
        editingEvent: null,
      }),

      openCategoryManager: () => set({ isCategoryManagerOpen: true }),

      closeCategoryManager: () => set({ isCategoryManagerOpen: false }),

      // Selectors
      getEventsByMonth: (year, month) => {
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));

        return filterEventsByDateRange(
          get().events,
          format(start, 'yyyy-MM-dd'),
          format(end, 'yyyy-MM-dd')
        );
      },

      getEventsByDateRange: (startDate, endDate) => {
        return filterEventsByDateRange(get().events, startDate, endDate);
      },

      getCategoryById: (id) => {
        return get().categories.find((cat) => cat.id === id);
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        // Initialize with defaults if no state
        if (!state || state.categories.length === 0) {
          const initial = getInitialStorage();
          return {
            ...state,
            categories: initial.categories,
            settings: initial.settings,
          };
        }
      },
    }
  )
);
```

### Step 2.5: Create Custom Hooks

**File**: `hooks/useCalendarEvents.ts`

```typescript
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
```

**File**: `hooks/useCategories.ts`

```typescript
import { useCalendarStore } from '@/lib/store/calendar-store';
import { Category } from '@/lib/types/calendar';

export function useCategories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  } = useCalendarStore();

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
```

### Deliverables
- ✅ Type definitions created
- ✅ Constants defined
- ✅ Date utilities implemented
- ✅ Event utilities implemented
- ✅ Storage utilities implemented
- ✅ Zustand store with persistence
- ✅ Custom hooks for events and categories

---

## Phase 3: Base UI Components

### Objectives
- Verify shadcn/ui components
- Build custom UI components (ColorPicker, ConfirmDialog)

### Step 3.1: Verify shadcn/ui Components

Check that these files exist in `components/ui/`:
- ✅ `button.tsx`
- ✅ `dialog.tsx`
- ✅ `input.tsx`
- ✅ `label.tsx`
- ✅ `select.tsx`
- ✅ `popover.tsx`

### Step 3.2: Build ColorPicker Component

**File**: `components/ui/ColorPicker.tsx`

```typescript
'use client';

import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { COLOR_PALETTE } from '@/lib/constants/calendar-constants';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <div
            className="h-4 w-4 rounded border"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <HexColorPicker color={color} onChange={onChange} />

          <div className="grid grid-cols-9 gap-2">
            {COLOR_PALETTE.map((presetColor) => (
              <button
                key={presetColor}
                className="h-6 w-6 rounded border hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Step 3.3: Build ConfirmDialog Component

**File**: `components/ui/ConfirmDialog.tsx`

```typescript
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Deliverables
- ✅ shadcn/ui components verified
- ✅ ColorPicker component built
- ✅ ConfirmDialog component built

---

## Phase 4: Calendar Components

### Objectives
- Build all calendar-specific components
- Implement calendar grid and day cells
- Create event rendering logic

### Implementation Order (Bottom-Up)

#### Step 4.1: EventBar Component

**File**: `components/calendar/EventBar.tsx`

```typescript
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
```

#### Step 4.2: DayCell Component

**File**: `components/calendar/DayCell.tsx`

```typescript
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
```

#### Step 4.3: DayGrid Component

**File**: `components/calendar/DayGrid.tsx`

```typescript
'use client';

import { DayData, CalendarEvent } from '@/lib/types/calendar';
import { DayCell } from './DayCell';
import { EventBar } from './EventBar';
import { DAY_NAMES_SHORT } from '@/lib/constants/calendar-constants';
import { calculateEventSegments } from '@/lib/utils/event-utils';

interface DayGridProps {
  days: DayData[];
  events: CalendarEvent[];
}

export function DayGrid({ days, events }: DayGridProps) {
  // Group days into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-0">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0">
        {DAY_NAMES_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="relative">
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0">
            {week.map((day) => (
              <DayCell key={day.dateString} day={day} />
            ))}
          </div>

          {/* Event bars overlaid on this week */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-7 gap-0 pt-7">
            {events.map((event) => {
              const segments = calculateEventSegments(event, week[0].dateString);
              return segments.map((segment, i) => (
                <div
                  key={`${event.id}-${i}`}
                  className="contents pointer-events-auto"
                >
                  <EventBar segment={segment} />
                </div>
              ));
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Step 4.4: MonthHeader Component

**File**: `components/calendar/MonthHeader.tsx`

```typescript
import { MONTH_NAMES } from '@/lib/constants/calendar-constants';

interface MonthHeaderProps {
  month: number;
  year: number;
}

export function MonthHeader({ month, year }: MonthHeaderProps) {
  return (
    <div className="text-center font-semibold text-lg mb-2">
      {MONTH_NAMES[month]}
    </div>
  );
}
```

#### Step 4.5: MonthCard Component

**File**: `components/calendar/MonthCard.tsx`

```typescript
'use client';

import { MonthHeader } from './MonthHeader';
import { DayGrid } from './DayGrid';
import { getMonthDays } from '@/lib/utils/date-utils';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

interface MonthCardProps {
  year: number;
  month: number;
}

export function MonthCard({ year, month }: MonthCardProps) {
  const { getEventsByMonth } = useCalendarEvents();
  const days = getMonthDays(year, month);
  const events = getEventsByMonth(year, month);

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
      <MonthHeader month={month} year={year} />
      <DayGrid days={days} events={events} />
    </div>
  );
}
```

#### Step 4.6: MonthGrid Component

**File**: `components/calendar/MonthGrid.tsx`

```typescript
'use client';

import { MonthCard } from './MonthCard';

interface MonthGridProps {
  year: number;
}

export function MonthGrid({ year }: MonthGridProps) {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {months.map((month) => (
        <MonthCard key={month} year={year} month={month} />
      ))}
    </div>
  );
}
```

#### Step 4.7: CalendarToolbar Component

**File**: `components/calendar/CalendarToolbar.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';

export function CalendarToolbar() {
  const {
    selectedYear,
    setSelectedYear,
    openEventModal,
    openCategoryManager,
  } = useCalendarStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSelectedYear(selectedYear - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{selectedYear}</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSelectedYear(selectedYear + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => openEventModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
        <Button variant="outline" onClick={() => openCategoryManager()}>
          <Settings className="h-4 w-4 mr-2" />
          Categories
        </Button>
      </div>
    </div>
  );
}
```

#### Step 4.8: YearCalendar Component

**File**: `components/calendar/YearCalendar.tsx`

```typescript
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
```

### Deliverables
- ✅ EventBar component with drag functionality
- ✅ DayCell component with drop functionality
- ✅ DayGrid component with event rendering
- ✅ MonthHeader component
- ✅ MonthCard component
- ✅ MonthGrid component with responsive layout
- ✅ CalendarToolbar component
- ✅ YearCalendar main container with drag-and-drop

---

## Phase 5: Modals & Forms

### Objectives
- Build EventModal for creating/editing events
- Build CategoryManager for managing categories

### Step 5.1: EventModal Component

**File**: `components/modals/EventModal.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useCategories } from '@/hooks/useCategories';

export function EventModal() {
  const {
    isEventModalOpen,
    closeEventModal,
    editingEvent,
  } = useCalendarStore();

  const { addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { categories } = useCategories();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!editingEvent?.id;

  // Load editing event data
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setStartDate(editingEvent.startDate);
      setEndDate(editingEvent.endDate);
      setCategoryId(editingEvent.categoryId);
      setNotes(editingEvent.notes || '');
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCategoryId(categories[0]?.id || '');
      setNotes('');
    }
  }, [editingEvent, categories]);

  const handleSave = () => {
    if (!title || !startDate || !endDate || !categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    if (startDate > endDate) {
      alert('End date must be after start date');
      return;
    }

    const eventData = {
      title,
      description,
      startDate,
      endDate,
      categoryId,
      notes,
    };

    if (isEditing) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    closeEventModal();
  };

  const handleDelete = () => {
    if (editingEvent?.id) {
      deleteEvent(editingEvent.id);
      closeEventModal();
    }
  };

  return (
    <>
      <Dialog open={isEventModalOpen} onOpenChange={closeEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={closeEventModal}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
```

### Step 5.2: CategoryManager Component

**File**: `components/modals/CategoryManager.tsx`

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCategories } from '@/hooks/useCategories';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function CategoryManager() {
  const {
    isCategoryManagerOpen,
    closeCategoryManager,
  } = useCalendarStore();

  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName) return;

    addCategory({ name: newName, color: newColor });
    setNewName('');
    setNewColor('#3B82F6');
  };

  const handleUpdate = (id: string, name: string, color: string) => {
    updateCategory(id, { name, color });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirm(null);
  };

  return (
    <>
      <Dialog open={isCategoryManagerOpen} onOpenChange={closeCategoryManager}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Existing categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded border"
                >
                  <div
                    className="h-6 w-6 rounded flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1">{category.name}</span>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(category.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {category.name !== 'Other' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new category */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Add New Category</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="newName">Name</Label>
                  <Input
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <ColorPicker color={newColor} onChange={setNewColor} />
                </div>
                <Button onClick={handleAdd} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete Category"
        description="Events in this category will be moved to 'Other'. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
      />
    </>
  );
}
```

### Deliverables
- ✅ EventModal with create/edit/delete functionality
- ✅ CategoryManager with CRUD operations
- ✅ Form validation
- ✅ Delete confirmations

---

## Phase 6: Drag & Drop

### Objectives
- Integrate @dnd-kit into calendar components
- Implement drag-and-drop event rescheduling

### Implementation Notes

Drag & drop is already implemented in:
- **YearCalendar.tsx**: `<DndContext>` wrapper with `handleDragEnd`
- **EventBar.tsx**: `useDraggable` hook
- **DayCell.tsx**: `useDroppable` hook

### Testing Checklist
- [ ] Drag event within same month
- [ ] Drag event to different month
- [ ] Multi-day event maintains duration when dragged
- [ ] Visual feedback during drag (opacity change)
- [ ] Drop zones highlight on hover
- [ ] Cancel drag by releasing outside calendar

### Deliverables
- ✅ Drag & drop fully integrated
- ✅ Event duration preserved when rescheduling
- ✅ Visual feedback implemented

---

## Phase 7: Integration & Styling

### Objectives
- Update main page with calendar
- Update layout metadata
- Add final styles to globals.css
- Ensure responsive design

### Step 7.1: Update Main Page

**File**: `app/page.tsx`

```typescript
import { YearCalendar } from '@/components/calendar/YearCalendar';
import { EventModal } from '@/components/modals/EventModal';
import { CategoryManager } from '@/components/modals/CategoryManager';

export default function Home() {
  return (
    <>
      <YearCalendar />
      <EventModal />
      <CategoryManager />
    </>
  );
}
```

### Step 7.2: Update Layout Metadata

**File**: `app/layout.tsx`

Update metadata:
```typescript
export const metadata: Metadata = {
  title: 'Linear Calendar - Year at a Glance',
  description: 'View and manage your entire year in a single calendar view with drag-and-drop event scheduling.',
};
```

### Step 7.3: Add Calendar Styles

**File**: `app/globals.css`

Add at the end:
```css
/* Calendar-specific styles */
.calendar-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.calendar-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.calendar-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.calendar-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Event bar animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.event-bar-enter {
  animation: slideIn 0.2s ease-out;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .month-card {
    min-width: 100%;
  }
}
```

### Step 7.4: Install Lucide Icons (if not already)

```bash
npm install lucide-react
```

### Deliverables
- ✅ Main page updated with all components
- ✅ Layout metadata updated
- ✅ Calendar styles added
- ✅ Responsive design verified
- ✅ Dark mode support confirmed

---

## Phase 8: Testing & Polish

### Objectives
- Test all features thoroughly
- Fix any bugs
- Polish UI/UX
- Optimize performance

### Testing Checklist

#### Core Functionality
- [ ] Create single-day event
- [ ] Create multi-day event (spanning weeks)
- [ ] Create event spanning months
- [ ] Edit event details
- [ ] Delete event with confirmation
- [ ] Drag event to new date (same month)
- [ ] Drag event to new date (different month)
- [ ] Create new category
- [ ] Edit category color
- [ ] Delete category (events moved to "Other")

#### Persistence
- [ ] Create event, reload page (verify saved)
- [ ] Edit event, reload page (verify changes)
- [ ] Delete event, reload page (verify deleted)
- [ ] Clear local storage, reload (verify defaults created)

#### Responsive Design
- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Test landscape orientation

#### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader friendly (test with NVDA/VoiceOver)
- [ ] High contrast mode

#### Dark Mode
- [ ] All components visible
- [ ] Proper contrast ratios
- [ ] Event colors readable

### Performance Optimization

- [ ] Use `React.memo` on DayCell and EventBar
- [ ] Use `useMemo` for expensive calculations
- [ ] Verify no unnecessary re-renders
- [ ] Check bundle size

### Edge Cases to Test

- [ ] Events spanning year boundaries (Dec 31 - Jan 2)
- [ ] Leap year (February 29)
- [ ] Very long event titles (should truncate)
- [ ] Many events on one day
- [ ] Empty state (no events)
- [ ] Category deletion with associated events

### Deliverables
- ✅ All features tested and working
- ✅ Bugs fixed
- ✅ UI polished
- ✅ Performance optimized
- ✅ Responsive on all devices
- ✅ Dark mode working
- ✅ Accessibility verified

---

## Success Criteria

The MVP is complete when:
- ✅ All 12 months display in responsive grid
- ✅ Users can view entire year at a glance
- ✅ Events can be created, edited, and deleted
- ✅ Events can be rescheduled via drag and drop
- ✅ Events are color-coded by category
- ✅ Multi-day events span visually across days
- ✅ Data persists in local storage
- ✅ Responsive design works on all screen sizes
- ✅ Dark mode is supported
- ✅ All interactions are smooth and intuitive

---

## Resources

### Documentation
- [shadcn/ui](https://ui.shadcn.com/) - UI Component system
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- [Next.js App Router](https://nextjs.org/docs/app)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [date-fns](https://date-fns.org/docs/Getting-Started)
- [@dnd-kit](https://docs.dndkit.com/)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Inspiration
- Google Calendar (year view)
- Teamup Calendar (linear view)
- Linear calendar design patterns

---

## Future Enhancements

### Backend Migration (NestJS)
When building the backend:
1. Keep store actions unchanged (abstract data layer)
2. Replace local storage with API calls
3. Add user authentication (JWT)
4. Enable multi-device sync
5. Add real-time updates (WebSockets)

### Additional Features (Post-MVP)
- Event search and filtering
- Recurring events
- Event reminders/notifications
- Export to iCal/Google Calendar
- Import from other calendars
- Event templates
- Keyboard shortcuts
- Undo/redo functionality
- Print view
- Event attachments
- Collaboration features
