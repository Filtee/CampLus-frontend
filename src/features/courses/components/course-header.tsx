import { Archive, CalendarOff, Lock, ShieldCheck, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Course, Semester } from '@/types';

interface CourseHeaderProps {
  course: Course;
  semesters: Semester[];
  activeId: string;
  onChange: (id: string) => void;
}

// Read-only course summary surface. Editing / version-history actions are intentionally
// absent in the v1 read-only experience.
export function CourseHeader({ course, semesters, activeId, onChange }: CourseHeaderProps) {
  const active = semesters.find((s) => s.id === activeId) ?? semesters[0];
  const hasCurrentOffering = semesters.some((s) => s.isCurrent);
  const viewingArchived = !active.isCurrent;
  const maintainers = active.maintainers ?? [];

  return (
    <Card className="gap-4 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 font-mono text-sm font-semibold">
            {course.code}
          </span>
          <Badge variant="secondary">{course.category}</Badge>
        </div>
        {active.isCurrent ? (
          <Badge className="border-success/30 bg-success/10 text-success border">本学期开课</Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            {hasCurrentOffering ? '历史归档' : '本学期未开课'}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight break-words sm:text-3xl">{course.name}</h1>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span>{course.department}</span>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <span>{course.credits} 学分</span>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <span>任课 {active.teacher}</span>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {active.enrolledCount} 人修读
          </span>
        </div>
      </div>

      {course.description && (
        <p className="text-foreground/80 max-w-prose text-sm leading-relaxed">
          {course.description}
        </p>
      )}

      {maintainers.length > 0 && (
        <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
          <ShieldCheck className="text-primary size-4" aria-hidden />
          维护者{' '}
          <span className="text-foreground/80">
            {maintainers.map((m) => m.realName).join('、')}
          </span>
        </p>
      )}

      {semesters.length > 1 && (
        <div
          role="group"
          aria-label="选择学期"
          className="border-border bg-muted/40 inline-flex items-center gap-1 rounded-lg border p-1"
        >
          {semesters.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              aria-pressed={s.id === activeId}
              className={cn(
                'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2',
                s.id === activeId
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s.term}
              {!s.isCurrent && <Lock className="size-3" aria-label="历史归档" />}
            </button>
          ))}
        </div>
      )}

      {!hasCurrentOffering ? (
        <Alert>
          <CalendarOff />
          <AlertDescription>
            这门课本学期未开课。以下为{' '}
            <span className="text-foreground font-medium">{active.term}</span>{' '}
            的历史归档，仅供参考。
          </AlertDescription>
        </Alert>
      ) : (
        viewingArchived && (
          <Alert>
            <Archive />
            <AlertDescription>
              你正在查看 <span className="text-foreground font-medium">{active.term}</span>{' '}
              的历史归档，内容只读。
            </AlertDescription>
          </Alert>
        )
      )}
    </Card>
  );
}
