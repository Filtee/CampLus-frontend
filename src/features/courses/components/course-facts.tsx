import { CalendarClock, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { latestUpdate, nextDeadline } from '@/features/courses/course-utils';
import { NODE_META } from '@/features/courses/node-meta';
import { dueUrgency, formatDate, relativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { NodeType, TimelineNode } from '@/types';

const URGENCY_TEXT = {
  overdue: 'text-destructive',
  soon: 'text-warning',
  upcoming: 'text-foreground/80',
} as const;

const LEGEND_ORDER: NodeType[] = ['announcement', 'assignment', 'exam', 'material', 'milestone'];

// Secondary column on the course page: timeline-derived facts + a type legend so the
// timeline's colour coding is never the only signal.
export function CourseFacts({ nodes }: { nodes?: TimelineNode[] }) {
  const list = nodes ?? [];
  const due = nextDeadline(list);
  const updated = latestUpdate(list);

  return (
    <div className="space-y-4">
      <Card className="gap-3 p-4">
        <h2 className="text-sm font-semibold">本学期概览</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs">下一个截止</dt>
            <dd className="mt-1">
              {due?.dueDate ? (
                <span className="flex items-center gap-2">
                  <span
                    className={cn('size-2 shrink-0 rounded-full', NODE_META[due.type].dot)}
                    aria-hidden
                  />
                  <span className="truncate">{due.title}</span>
                  <span
                    className={cn(
                      'ml-auto inline-flex shrink-0 items-center gap-1 font-medium',
                      URGENCY_TEXT[dueUrgency(due.dueDate)],
                    )}
                  >
                    <CalendarClock className="size-3.5" aria-hidden />
                    {relativeDays(due.dueDate)}
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground">近期没有截止</span>
              )}
            </dd>
          </div>
          <div className="border-border border-t pt-3">
            <dt className="text-muted-foreground text-xs">最近更新</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5">
              {updated ? (
                <>
                  <History className="text-muted-foreground size-3.5" aria-hidden />
                  {formatDate(updated)}
                </>
              ) : (
                <span className="text-muted-foreground">暂无内容</span>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="gap-3 p-4">
        <h2 className="text-sm font-semibold">节点类型</h2>
        <ul className="space-y-2">
          {LEGEND_ORDER.map((type) => {
            const meta = NODE_META[type];
            return (
              <li key={type} className="flex items-center gap-2 text-sm">
                <span className={cn('size-2.5 shrink-0 rounded-full', meta.dot)} aria-hidden />
                <meta.Icon className="text-muted-foreground size-3.5" aria-hidden />
                <span className="text-foreground/80">{meta.label}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
