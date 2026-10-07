import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CatalogFacets, CatalogFilters } from '@/features/courses/course-utils';

interface CourseFiltersProps {
  filters: CatalogFilters;
  facets: CatalogFacets;
  resultCount: number;
  onChange: (next: CatalogFilters) => void;
}

// Native <select> keeps the control keyboard- and screen-reader-accessible without a new
// dependency, styled to match shadcn inputs.
const selectClass =
  'border-input bg-background text-foreground focus-visible:ring-ring focus-visible:border-ring h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] sm:w-auto';

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`移除筛选：${label}`}
        className="hover:bg-background/70 focus-visible:ring-ring rounded-sm p-0.5 outline-none focus-visible:ring-2"
      >
        <X className="size-3" aria-hidden />
      </button>
    </Badge>
  );
}

export function CourseFilters({ filters, facets, resultCount, onChange }: CourseFiltersProps) {
  const hasActive = filters.query !== '' || filters.term !== '' || filters.category !== '';
  const clearAll = () => onChange({ query: '', term: '', category: '' });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="搜索课程名称或代码…"
            aria-label="搜索课程"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <select
            className={selectClass}
            value={filters.term}
            onChange={(e) => onChange({ ...filters, term: e.target.value })}
            aria-label="按学期筛选"
          >
            <option value="">全部学期</option>
            {facets.terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            aria-label="按类别筛选"
          >
            <option value="">全部类别</option>
            {facets.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex min-h-7 flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm" role="status" aria-live="polite">
          共 {resultCount} 门课程
        </span>
        {hasActive && (
          <>
            <span className="bg-border h-4 w-px" aria-hidden />
            {filters.query && (
              <FilterChip
                label={`“${filters.query}”`}
                onRemove={() => onChange({ ...filters, query: '' })}
              />
            )}
            {filters.term && (
              <FilterChip
                label={filters.term}
                onRemove={() => onChange({ ...filters, term: '' })}
              />
            )}
            {filters.category && (
              <FilterChip
                label={filters.category}
                onRemove={() => onChange({ ...filters, category: '' })}
              />
            )}
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={clearAll}>
              清除全部
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
