import { CalendarClock, GraduationCap, NotebookPen, ScrollText } from 'lucide-react';
import { SOURCE_LABEL } from '@/features/courses/node-meta';
import { formatDate } from '@/lib/format';
import type { NodeSource, NodeSourceKind } from '@/types';
import type { LucideIcon } from 'lucide-react';

const SOURCE_ICON: Record<NodeSourceKind, LucideIcon> = {
  'in-class': GraduationCap,
  'student-curated': NotebookPen,
  syllabus: ScrollText,
};

// 信息来源标注 —— 责任可追溯（设计原则 4）
export function SourceBadge({ source }: { source: NodeSource }) {
  const Icon = SOURCE_ICON[source.kind];
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
      <Icon className="size-3.5" />
      <span className="text-foreground/70 font-medium">{SOURCE_LABEL[source.kind]}</span>
      <span className="text-muted-foreground/80">· {source.note}</span>
      {source.announcedAt && (
        <span className="text-muted-foreground/80 inline-flex items-center gap-1">
          <CalendarClock className="size-3.5" />
          {formatDate(source.announcedAt)}
        </span>
      )}
    </span>
  );
}
