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
