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
