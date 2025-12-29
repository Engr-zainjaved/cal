'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';

export function CalendarToolbar() {
  const {
    selectedYear,
    setSelectedYear,
    monthsPerRow,
    setMonthsPerRow,
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Months per row:
          </span>
          <Select
            value={monthsPerRow.toString()}
            onValueChange={(value) => setMonthsPerRow(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
