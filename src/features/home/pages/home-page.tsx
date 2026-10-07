import { Skeleton } from '@/components/ui/skeleton';
import { useMe } from '@/features/account/api/account';
import { useCourses } from '@/features/courses/api/courses';
import { CourseCard } from '@/features/courses/components/course-card';
import { UpcomingList, type UpcomingItem } from '@/features/home/components/upcoming-list';

function greeting(hour = new Date().getHours()): string {
  if (hour < 6) return '夜深了';
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export function HomePage() {
  const { data: me } = useMe();
  const { data: courses, isLoading } = useCourses();

  const upcoming: UpcomingItem[] = (courses ?? [])
    .flatMap((c) => (c.nextDue ? [{ course: c.course, due: c.nextDue }] : []))
    .sort((a, b) => a.due.dueDate.localeCompare(b.due.dueDate));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}
          {me ? `，${me.realName}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">
          本学期 {courses?.length ?? '—'} 门课 · 待跟进 {isLoading ? '—' : upcoming.length} 项
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <h2 className="text-muted-foreground text-sm font-semibold">我的课程</h2>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses?.map((summary) => (
                <CourseCard key={summary.course.id} summary={summary} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <h2 className="text-muted-foreground text-sm font-semibold">待跟进</h2>
          <UpcomingList items={upcoming} isLoading={isLoading} />
        </aside>
      </div>
    </div>
  );
}
