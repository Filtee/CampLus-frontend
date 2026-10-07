import { Link } from '@tanstack/react-router';
import { CalendarCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { NODE_META } from '@/features/courses/node-meta';
import { dueUrgency, relativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Course, CourseSummary } from '@/types';

export interface UpcomingItem {
  course: Course;
  due: NonNullable<CourseSummary['nextDue']>;
}

const URGENCY_TEXT = {
  overdue: 'text-destructive',
  soon: 'text-warning',
  upcoming: 'text-muted-foreground',
} as const;

export function UpcomingList({ items, isLoading }: { items: UpcomingItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-border text-muted-foreground flex items-center gap-2.5 rounded-lg border border-dashed px-4 py-5 text-sm">
        <CalendarCheck className="text-success size-4 shrink-0" />
        近期没有待跟进的截止，喘口气。
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map(({ course, due }) => (
        <li key={due.nodeId}>
          <Link
            to="/courses/$courseId"
            params={{ courseId: course.id }}
            className="border-border bg-card hover:border-primary/40 flex items-center gap-3 rounded-lg border px-3.5 py-3 shadow-xs transition-colors"
          >
            <span className={cn('size-2.5 shrink-0 rounded-full', NODE_META[due.type].dot)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{due.title}</p>
              <p className="text-muted-foreground truncate text-xs">
                {course.code} · {course.name}
              </p>
            </div>
            <span
              className={cn('shrink-0 text-sm font-medium', URGENCY_TEXT[dueUrgency(due.dueDate)])}
            >
              {relativeDays(due.dueDate)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
