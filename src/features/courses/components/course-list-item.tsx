import { Link } from '@tanstack/react-router';
import { CalendarOff, Clock, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NODE_META } from '@/features/courses/node-meta';
import { dueUrgency, formatDate, relativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CourseCatalogItem } from '@/types';

const URGENCY_TEXT = {
  overdue: 'text-destructive',
  soon: 'text-warning',
  upcoming: 'text-muted-foreground',
} as const;

export function CourseListItem({ item }: { item: CourseCatalogItem }) {
  const { course, currentSemester, nextDue, lastUpdatedAt, termCount } = item;

  return (
    <li>
      <Link
        to="/courses/$courseId"
        params={{ courseId: course.id }}
        aria-label={`${course.name}（${course.code}）`}
        className="focus-visible:ring-ring block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Card className="hover:border-primary/40 hover:bg-accent/30 h-full gap-3 p-4 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
              {course.code}
            </span>
            <Badge variant="secondary" className="font-normal">
              {course.category}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="line-clamp-2 leading-snug font-semibold break-words">{course.name}</h3>
            <p className="text-muted-foreground text-xs">
              {course.department} · {course.credits} 学分
              {currentSemester && ` · ${currentSemester.teacher}`}
            </p>
          </div>

          {course.description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {course.description}
            </p>
          ) : (
            <p className="text-muted-foreground/70 text-sm italic">课程简介待同学补充</p>
          )}

          <div className="border-border mt-auto flex min-h-9 items-center border-t pt-3 text-sm">
            {!currentSemester ? (
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <CalendarOff className="size-3.5" aria-hidden />
                本学期未开课 · {termCount} 个归档学期
              </span>
            ) : nextDue ? (
              <span className="flex w-full items-center gap-2">
                <span
                  className={cn('size-2 shrink-0 rounded-full', NODE_META[nextDue.type].dot)}
                  aria-hidden
                />
                <span className="text-foreground/80 truncate">{nextDue.title}</span>
                <span
                  className={cn(
                    'ml-auto inline-flex shrink-0 items-center gap-1 font-medium',
                    URGENCY_TEXT[dueUrgency(nextDue.dueDate)],
                  )}
                >
                  <Clock className="size-3.5" aria-hidden />
                  {relativeDays(nextDue.dueDate)}
                </span>
              </span>
            ) : lastUpdatedAt ? (
              <span className="text-muted-foreground inline-flex items-center gap-1.5">
                <History className="size-3.5" aria-hidden />
                最近更新 {formatDate(lastUpdatedAt)}
              </span>
            ) : (
              <span className="text-muted-foreground">{currentSemester.term} · 本学期暂无内容</span>
            )}
          </div>
        </Card>
      </Link>
    </li>
  );
}
