import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { NODE_META } from '@/features/courses/node-meta';
import { dueUrgency, relativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CourseSummary } from '@/types';

const URGENCY_TEXT = {
  overdue: 'text-destructive',
  soon: 'text-warning',
  upcoming: 'text-muted-foreground',
} as const;

export function CourseCard({ summary }: { summary: CourseSummary }) {
  const { course, currentSemester, nextDue, weekHighlights } = summary;

  return (
    <Link to="/courses/$courseId" params={{ courseId: course.id }} className="group block h-full">
      <div className="border-border bg-card group-hover:border-primary/40 flex h-full flex-col rounded-xl border p-5 shadow-xs transition-all group-hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
            {course.code}
          </span>
          <Badge variant="secondary" className="text-xs">
            {course.category}
          </Badge>
        </div>

        <h3 className="text-foreground group-hover:text-primary mt-3 font-semibold transition-colors">
          {course.name}
        </h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {currentSemester.teacher} · {currentSemester.term}
        </p>

        <div className="border-border mt-4 flex flex-1 items-end border-t pt-4">
          {nextDue ? (
            <div className="flex w-full items-center gap-2 text-sm">
              <span className={cn('size-2 shrink-0 rounded-full', NODE_META[nextDue.type].dot)} />
              <span className="text-foreground/80 truncate">{nextDue.title}</span>
              <span
                className={cn(
                  'ml-auto shrink-0 font-medium',
                  URGENCY_TEXT[dueUrgency(nextDue.dueDate)],
                )}
              >
                {relativeDays(nextDue.dueDate)}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {weekHighlights > 0 ? `本周 ${weekHighlights} 项更新` : '本周暂无新内容'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
