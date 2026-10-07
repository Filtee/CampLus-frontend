import { AlertCircle, CheckCircle2, Clock, History, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SourceBadge } from '@/features/courses/components/source-badge';
import { NODE_META } from '@/features/courses/node-meta';
import { dueUrgency, formatDate, formatDateTime, relativeDays } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TimelineNode } from '@/types';

// Verb for the deadline, by node type (empty when a date is not a "deadline").
const DUE_LABEL: Record<TimelineNode['type'], string> = {
  announcement: '',
  assignment: '截止',
  exam: '开考',
  material: '',
  milestone: '截止',
};

// Urgency drives both colour AND an icon + relative-time text, so status never relies on
// colour alone (accessibility requirement).
const URGENCY = {
  overdue: { cls: 'bg-destructive/10 text-destructive', Icon: AlertCircle },
  soon: { cls: 'bg-warning/15 text-warning', Icon: Clock },
  upcoming: { cls: 'bg-muted text-muted-foreground', Icon: Clock },
} as const;

function DuePill({ node }: { node: TimelineNode }) {
  if (!node.dueDate) return null;
  const { cls, Icon } = URGENCY[dueUrgency(node.dueDate)];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        cls,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {DUE_LABEL[node.type]} {formatDateTime(node.dueDate)}
      <span className="opacity-70">· {relativeDays(node.dueDate)}</span>
    </span>
  );
}

export function TimelineNodeCard({ node }: { node: TimelineNode }) {
  const meta = NODE_META[node.type];

  return (
    <article className="border-border bg-card relative overflow-hidden rounded-xl border shadow-xs">
      {/* Left colour bar: redundant type cue alongside the badge icon + label. */}
      <span className={cn('absolute inset-y-0 left-0 w-1', meta.rail)} aria-hidden />

      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn('gap-1 font-medium', meta.chip)}>
              <meta.Icon className="size-3.5" aria-hidden />
              {meta.label}
            </Badge>
            {node.official && (
              <Badge
                variant="outline"
                className="border-success/30 bg-success/10 text-success gap-1"
              >
                <CheckCircle2 className="size-3.5" aria-hidden />
                官方确认
              </Badge>
            )}
            {node.source.provisional && (
              <Badge
                variant="outline"
                className="border-warning/40 bg-warning/15 text-warning gap-1"
              >
                <TriangleAlert className="size-3.5" aria-hidden />
                暂定
              </Badge>
            )}
          </div>
          <DuePill node={node} />
        </div>

        <h4 className="text-foreground mt-3 text-base font-semibold break-words">{node.title}</h4>
        <p className="text-foreground/80 mt-1.5 text-sm leading-relaxed">{node.body}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <SourceBadge source={node.source} />
          <span className="text-muted-foreground text-xs">
            由 <span className="text-foreground/70 font-medium">{node.createdBy.realName}</span>{' '}
            创建
          </span>

          {node.history.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded text-xs outline-none focus-visible:ring-2"
                >
                  <History className="size-3.5" aria-hidden />
                  编辑 {node.history.length} 次
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {node.history.map((h) => (
                  <div key={h.id}>
                    {h.editor.realName} · {formatDate(h.editedAt)}：{h.summary}
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
}
