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
