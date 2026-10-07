import { CalendarRange } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TimelineNodeCard } from '@/features/courses/components/timeline-node';
import { weekStatus, type WeekStatus } from '@/features/courses/course-utils';
import { cn } from '@/lib/utils';
import type { TimelineNode } from '@/types';

interface TimelineProps {
  nodes?: TimelineNode[];
  isLoading: boolean;
  currentWeek?: number;
}

interface WeekGroup {
  week: number;
  nodes: TimelineNode[];
}

function groupByWeek(nodes: TimelineNode[]): WeekGroup[] {
  const map = new Map<number, TimelineNode[]>();
  for (const node of nodes) {
    const list = map.get(node.week) ?? [];
    list.push(node);
    map.set(node.week, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([week, weekNodes]) => ({ week, nodes: weekNodes }));
}

const MARKER: Record<WeekStatus, string> = {
  past: 'bg-muted-foreground/40',
  current: 'bg-primary',
  upcoming: 'border-muted-foreground/40 border-2 bg-background',
};

function WeekHeading({ week, status }: { week: number; status: WeekStatus }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn('ring-background size-3 shrink-0 rounded-full ring-4', MARKER[status])}
        aria-hidden
      />
      <h3
        className={cn(
          'shrink-0 text-sm font-semibold',
          status === 'past' ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        第 {week} 周
      </h3>
      {status === 'current' && (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 h-5 px-2">本周</Badge>
      )}
      {status === 'past' && <span className="text-muted-foreground text-xs">已结束</span>}
      <span className="bg-border h-px flex-1" aria-hidden />
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {[0, 1].map((g) => (
        <div key={g} className="space-y-3">
          <Skeleton className="h-4 w-20" />
          {[0, 1].map((n) => (
            <div key={n} className="border-border bg-card space-y-3 rounded-xl border p-5">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Timeline({ nodes, isLoading, currentWeek }: TimelineProps) {
  if (isLoading) return <TimelineSkeleton />;

  if (!nodes || nodes.length === 0) {
    return (
      <EmptyState
        Icon={CalendarRange}
        title="这个学期还没有内容"
        description="Timeline 由修读这门课的同学共同维护。添加第一个公告、作业或资料，让它开始生长。"
      />
    );
  }

  const groups = groupByWeek(nodes);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.week} className="space-y-4">
          <WeekHeading week={group.week} status={weekStatus(group.week, currentWeek)} />
          {/* Left spine suggests the layered timeline structure. */}
          <div className="border-border ml-1.5 space-y-3 border-l pl-5">
            {group.nodes.map((node) => (
              <TimelineNodeCard key={node.id} node={node} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
