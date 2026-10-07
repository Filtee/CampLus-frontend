import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SourceBadge } from '@/features/courses/components/source-badge';
import type { NodeSource } from '@/types';

// Source attribution is a traceability requirement (设计原则 4): the badge must surface the
// human-readable origin of a Timeline node, and show the announced date only when present.
describe('SourceBadge', () => {
  it('renders the human-readable label, note, and formatted date for a curated source', () => {
    const announcedAt = new Date(2026, 8, 15, 12, 0, 0); // local Sep 15 2026, noon
    const expectedDate = new Intl.DateTimeFormat('zh-CN', {
      month: 'long',
      day: 'numeric',
    }).format(announcedAt);

    const source: NodeSource = {
      kind: 'student-curated',
      note: '据课程大纲',
      announcedAt: announcedAt.toISOString(),
    };
    render(<SourceBadge source={source} />);

    expect(screen.getByText('学生整理')).toBeInTheDocument();
    expect(screen.getByText(/据课程大纲/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(expectedDate))).toBeInTheDocument();
  });

  it('omits the date when the source has no announcedAt', () => {
    const source: NodeSource = { kind: 'in-class', note: '课堂宣布于第一周' };
    render(<SourceBadge source={source} />);

    expect(screen.getByText('课堂宣布')).toBeInTheDocument();
    expect(screen.queryByText(/月/)).not.toBeInTheDocument();
  });
});
