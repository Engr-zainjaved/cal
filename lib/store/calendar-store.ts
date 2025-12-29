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
      monthsPerRow: 3,
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

      setMonthsPerRow: (months) => set({ monthsPerRow: Math.max(1, Math.min(4, months)) }),

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
