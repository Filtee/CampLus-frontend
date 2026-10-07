import { describe, expect, it } from 'vitest';
import {
  catalogFacets,
  filterCatalog,
  latestUpdate,
  nextDeadline,
  weekStatus,
} from '@/features/courses/course-utils';
import type { Course, CourseCatalogItem, Semester, TimelineNode } from '@/types';

function course(id: string, code: string, name: string, category: Course['category']): Course {
  return { id, code, name, department: '计算机科学与技术学院', credits: 3, category };
}

function sem(courseId: string, term: string): Semester {
  return {
    id: `s-${courseId}-${term}`,
    courseId,
    term,
    teacher: '周则明',
    weeks: 16,
    enrolledCount: 100,
    isCurrent: true,
  };
}

const catalog: CourseCatalogItem[] = [
  {
    course: course('c-cs101', 'CS101', '数据结构与算法', '专业必修'),
    currentSemester: sem('c-cs101', '2026 秋'),
    terms: ['2026 秋', '2025 秋'],
    termCount: 2,
  },
  {
    course: course('c-math201', 'MATH201', '概率论与数理统计', '通识必修'),
    currentSemester: sem('c-math201', '2026 秋'),
    terms: ['2026 秋'],
    termCount: 1,
  },
  {
    // No current offering: still browsable, and filterable by its archived term.
    course: course('c-cs310', 'CS310', '编译原理', '专业选修'),
    terms: ['2025 秋'],
    termCount: 1,
  },
];

const ids = (items: CourseCatalogItem[]) => items.map((i) => i.course.id);

describe('filterCatalog', () => {
  it('matches the query against course name and code, case-insensitively', () => {
    expect(ids(filterCatalog(catalog, { query: '算法', term: '', category: '' }))).toEqual([
      'c-cs101',
    ]);
    expect(ids(filterCatalog(catalog, { query: 'cs3', term: '', category: '' }))).toEqual([
      'c-cs310',
    ]);
  });

  it('filters by any term the course was offered in (current or archived)', () => {
    expect(ids(filterCatalog(catalog, { query: '', term: '2026 秋', category: '' }))).toEqual([
      'c-cs101',
      'c-math201',
    ]);
    expect(ids(filterCatalog(catalog, { query: '', term: '2025 秋', category: '' }))).toEqual([
      'c-cs101',
      'c-cs310',
    ]);
  });

  it('filters by category and combines filters', () => {
    expect(ids(filterCatalog(catalog, { query: '', term: '', category: '通识必修' }))).toEqual([
      'c-math201',
    ]);
    expect(
      ids(filterCatalog(catalog, { query: 'c', term: '2025 秋', category: '专业选修' })),
    ).toEqual(['c-cs310']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterCatalog(catalog, { query: 'zzz', term: '', category: '' })).toEqual([]);
  });
});

describe('catalogFacets', () => {
  it('derives the union of all offered terms and all categories from the data', () => {
    const facets = catalogFacets(catalog);
    expect(facets.terms).toEqual(['2026 秋', '2025 秋']); // newest term first
    expect(facets.categories).toEqual(['专业必修', '通识必修', '专业选修']);
  });
});

function node(id: string, over: Partial<TimelineNode>): TimelineNode {
  return {
    id,
    semesterId: 's',
    week: 1,
    type: 'assignment',
    title: id,
    body: '',
    source: { kind: 'in-class', note: '' },
    official: false,
    createdBy: { id: 'u', realName: '林晚' },
    createdAt: '2026-09-01T00:00:00+08:00',
    history: [],
    discussionCount: 0,
    ...over,
  };
}

describe('nextDeadline', () => {
  it('returns the soonest node whose deadline is still in the future', () => {
    const now = new Date(2026, 9, 6, 12, 0, 0);
    const nodes = [
      node('past', { dueDate: new Date(2026, 8, 20, 23, 59).toISOString() }),
      node('soon', { dueDate: new Date(2026, 9, 8, 23, 59).toISOString() }),
      node('later', { dueDate: new Date(2026, 9, 20, 14, 0).toISOString() }),
      node('no-date', { dueDate: undefined }),
    ];
    expect(nextDeadline(nodes, now)?.id).toBe('soon');
  });

  it('returns undefined when every deadline is in the past or missing', () => {
    const now = new Date(2026, 9, 6, 12, 0, 0);
    const nodes = [node('past', { dueDate: new Date(2026, 8, 1).toISOString() }), node('none', {})];
    expect(nextDeadline(nodes, now)).toBeUndefined();
  });
});

describe('latestUpdate', () => {
  it('returns the newest timestamp across creation and edit history', () => {
    const nodes = [
      node('a', { createdAt: '2026-09-01T00:00:00+08:00' }),
      node('b', {
        createdAt: '2026-09-10T00:00:00+08:00',
        history: [
          {
            id: 'e',
            editor: { id: 'u', realName: '苏青' },
            editedAt: '2026-09-25T00:00:00+08:00',
            summary: '',
          },
        ],
      }),
    ];
    expect(latestUpdate(nodes)).toBe('2026-09-25T00:00:00+08:00');
  });

  it('returns undefined for an empty node set', () => {
    expect(latestUpdate([])).toBeUndefined();
  });
});

describe('weekStatus', () => {
  it('classifies past, current, and upcoming weeks', () => {
    expect(weekStatus(3, 5)).toBe('past');
    expect(weekStatus(5, 5)).toBe('current');
    expect(weekStatus(7, 5)).toBe('upcoming');
  });

  it('treats an archived term (no current week) as past', () => {
    expect(weekStatus(3, undefined)).toBe('past');
  });
});
