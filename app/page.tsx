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
