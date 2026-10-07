import type { CourseCatalogItem, CourseCategory, TimelineNode } from '@/types';

export interface CatalogFilters {
  query: string;
  term: string; // '' = all terms
  category: string; // '' = all categories
}

// Course matches the free-text query by name or code (case-insensitive, trimmed).
function matchesQuery(item: CourseCatalogItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const { name, code } = item.course;
  return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
}

export function filterCatalog(
  items: CourseCatalogItem[],
  { query, term, category }: CatalogFilters,
): CourseCatalogItem[] {
  return items.filter((item) => {
    if (!matchesQuery(item, query)) return false;
    // Term filter matches any term the course has been offered in (current or archived).
    if (term && !item.terms.includes(term)) return false;
    if (category && item.course.category !== category) return false;
    return true;
  });
}

export interface CatalogFacets {
  terms: string[];
  categories: CourseCategory[];
}

// Distinct, sorted filter options derived from the data (no hardcoded lists).
export function catalogFacets(items: CourseCatalogItem[]): CatalogFacets {
  const terms = new Set<string>();
  const categories = new Set<CourseCategory>();
  for (const item of items) {
    for (const term of item.terms) terms.add(term);
    categories.add(item.course.category);
  }
  return {
    terms: [...terms].sort((a, b) => b.localeCompare(a)), // newest term first
    categories: [...categories],
  };
}

// Soonest node whose deadline is still in the future.
export function nextDeadline(
  nodes: TimelineNode[],
  now: Date = new Date(),
): TimelineNode | undefined {
  return nodes
    .filter((n) => n.dueDate && new Date(n.dueDate) >= now)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))[0];
}

// Latest meaningful change across a node set: newest creation or edit timestamp (ISO).
export function latestUpdate(nodes: TimelineNode[]): string | undefined {
  return nodes
    .flatMap((n) => [n.createdAt, ...n.history.map((h) => h.editedAt)])
    .sort()
    .at(-1);
}

export type WeekStatus = 'past' | 'current' | 'upcoming';

// Temporal position of a teaching week relative to the current week. Drives non-color
// status cues (label + styling); when the term is archived currentWeek is undefined.
export function weekStatus(week: number, currentWeek?: number): WeekStatus {
  if (currentWeek === undefined) return 'past';
  if (week < currentWeek) return 'past';
  if (week === currentWeek) return 'current';
  return 'upcoming';
}
