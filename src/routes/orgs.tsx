import { createFileRoute } from '@tanstack/react-router';
import { OrgsPage } from '@/features/orgs/pages/orgs-page';

export const Route = createFileRoute('/orgs')({
  component: OrgsPage,
});
