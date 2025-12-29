import { YearTimeline } from '@/components/calendar/YearTimeline';
import { EventModal } from '@/components/modals/EventModal';
import { CategoryManager } from '@/components/modals/CategoryManager';

export default function Home() {
  return (
    <>
      <YearTimeline />
      <EventModal />
      <CategoryManager />
    </>
  );
}
