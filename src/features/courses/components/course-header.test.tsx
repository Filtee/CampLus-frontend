import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CourseHeader } from '@/features/courses/components/course-header';
import type { Course, Semester } from '@/types';

const course: Course = {
  id: 'c-cs101',
  code: 'CS101',
  name: '数据结构与算法',
  department: '计算机科学与技术学院',
  credits: 4,
  category: '专业必修',
};

function sem(over: Partial<Semester> & { id: string; term: string; isCurrent: boolean }): Semester {
  return { courseId: 'c-cs101', teacher: '周则明', weeks: 16, enrolledCount: 128, ...over };
}

const noop = () => {};

describe('CourseHeader status presentation', () => {
  it('shows an open badge, teacher, and maintainers for a current offering', () => {
    const current = sem({
      id: 's-current',
      term: '2026 秋',
      isCurrent: true,
      maintainers: [{ id: 'u-chen', realName: '陈野' }],
    });
    render(
      <CourseHeader course={course} semesters={[current]} activeId="s-current" onChange={noop} />,
    );
    expect(screen.getByText('本学期开课')).toBeInTheDocument();
    expect(screen.getByText(/任课 周则明/)).toBeInTheDocument();
    expect(screen.getByText('陈野')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('flags a course with no current offering and explains the archived state', () => {
    const archived = sem({ id: 's-2025', term: '2025 秋', isCurrent: false });
    render(
      <CourseHeader course={course} semesters={[archived]} activeId="s-2025" onChange={noop} />,
    );
    expect(screen.getByText('本学期未开课')).toBeInTheDocument(); // status badge
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('本学期未开课');
  });

  it('marks an archived view when a current offering also exists', () => {
    const current = sem({ id: 's-current', term: '2026 秋', isCurrent: true });
    const archived = sem({ id: 's-2025', term: '2025 秋', isCurrent: false });
    render(
      <CourseHeader
        course={course}
        semesters={[current, archived]}
        activeId="s-2025"
        onChange={noop}
      />,
    );
    expect(screen.getByText('历史归档')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('只读');
  });
});
