import { createFileRoute } from '@tanstack/react-router';
import { CourseDashboardPage } from '@/features/courses/pages/course-dashboard-page';

export const Route = createFileRoute('/courses/$courseId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  return <CourseDashboardPage courseId={courseId} />;
}
