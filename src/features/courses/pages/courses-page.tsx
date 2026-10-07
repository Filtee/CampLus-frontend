import { Library, SearchX, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourseCatalog } from '@/features/courses/api/courses';
import { CourseFilters } from '@/features/courses/components/course-filters';
import { CourseListItem } from '@/features/courses/components/course-list-item';
import { catalogFacets, filterCatalog, type CatalogFilters } from '@/features/courses/course-utils';

const EMPTY_FILTERS: CatalogFilters = { query: '', term: '', category: '' };

function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-full max-w-lg rounded-md" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function CoursesPage() {
  const { data, isLoading, isError, refetch } = useCourseCatalog();
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);

  const items = data ?? [];
  const facets = useMemo(() => catalogFacets(items), [items]);
  const filtered = useMemo(() => filterCatalog(items, filters), [items, filters]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">课程</h1>
        <p className="text-muted-foreground mt-1">
          浏览课程目录。每门课是一个由同学共同维护的结构化仪表盘。
        </p>
      </header>

      {isError ? (
        <EmptyState
          Icon={TriangleAlert}
          title="课程目录加载失败"
          description="没能取到课程数据。请检查网络连接后重试。"
          action={
            <Button variant="outline" onClick={() => void refetch()}>
              重试
            </Button>
          }
        />
      ) : isLoading ? (
        <CatalogSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          Icon={Library}
          title="还没有课程"
          description="课程目录由同学导入与维护。导入第一份课表，让目录开始生长。"
        />
      ) : (
        <>
          <CourseFilters
            filters={filters}
            facets={facets}
            resultCount={filtered.length}
            onChange={setFilters}
          />
          {filtered.length === 0 ? (
            <EmptyState
              Icon={SearchX}
              title="没有匹配的课程"
              description="换个关键词，或清除筛选条件再看看。"
              action={
                <Button variant="outline" onClick={() => setFilters(EMPTY_FILTERS)}>
                  清除筛选
                </Button>
              }
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <CourseListItem key={item.course.id} item={item} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
