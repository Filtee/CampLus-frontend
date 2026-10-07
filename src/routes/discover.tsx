import { createFileRoute } from '@tanstack/react-router';
import { DiscoverPage } from '@/features/discover/pages/discover-page';

export const Route = createFileRoute('/discover')({
  component: DiscoverPage,
});
