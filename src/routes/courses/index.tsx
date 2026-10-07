import { createFileRoute } from '@tanstack/react-router';
import { CoursesPage } from '@/features/courses/pages/courses-page';

export const Route = createFileRoute('/courses/')({
  component: CoursesPage,
});
