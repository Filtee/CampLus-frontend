import { Link } from '@tanstack/react-router';
import { SearchX } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/common/empty-state';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourse, useTimeline } from '@/features/courses/api/courses';
import { CourseFacts } from '@/features/courses/components/course-facts';
import { CourseHeader } from '@/features/courses/components/course-header';
import { Timeline } from '@/features/courses/components/timeline';

// Fall term start, used to highlight the current teaching week (kept in sync with the mock
// handlers). Only meaningful while the active semester is the current one.
const FALL_START = new Date('2026-09-08T00:00:00+08:00');
function teachingWeek(): number {
  return Math.max(1, Math.floor((Date.now() - FALL_START.getTime()) / (7 * 86_400_000)) + 1);
}

function CourseBreadcrumb({ current }: { current: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/courses">课程</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 max-w-[60vw]">{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function HeaderSkeleton() {
  return (
    <div className="border-border bg-card space-y-4 rounded-xl border p-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <Skeleton className="h-10 w-48 rounded-lg" />
    </div>
  );
}

export function CourseDashboardPage({ courseId }: { courseId: string }) {
  const { data, isLoading, isError } = useCourse(courseId);
  const [selected, setSelected] = useState<string>();

  const semesters = data?.semesters ?? [];
  const active =
    semesters.find((s) => s.id === selected) ?? semesters.find((s) => s.isCurrent) ?? semesters[0];

  const { data: nodes, isLoading: timelineLoading } = useTimeline(active?.id);

  if (isError) {
    return (
      <div className="space-y-6">
        <CourseBreadcrumb current="未找到" />
        <EmptyState
          Icon={SearchX}
          title="找不到这门课程"
          description="它可能尚未被任何同学录入，或链接已失效。返回课程目录看看其他课程。"
        />
      </div>
    );
  }

  if (isLoading || !data || !active) {
    return (
      <div className="space-y-6">
        <CourseBreadcrumb current="加载中…" />
        <HeaderSkeleton />
        <Timeline isLoading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CourseBreadcrumb current={data.course.name} />
      <CourseHeader
        course={data.course}
        semesters={semesters}
        activeId={active.id}
        onChange={setSelected}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline is the dominant element of the page. */}
        <div className="lg:col-span-2">
          <Timeline
            nodes={nodes}
            isLoading={timelineLoading}
            currentWeek={active.isCurrent ? teachingWeek() : undefined}
          />
        </div>
        <CourseFacts nodes={nodes} />
      </div>
    </div>
  );
}
