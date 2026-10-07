import { createFileRoute } from '@tanstack/react-router';
import { NoticesPage } from '@/features/notices/pages/notices-page';

export const Route = createFileRoute('/notices')({
  component: NoticesPage,
});
