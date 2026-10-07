import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TimelineNodeCard } from '@/features/courses/components/timeline-node';
import type { TimelineNode } from '@/types';

function node(over: Partial<TimelineNode>): TimelineNode {
  return {
    id: 'n',
    semesterId: 's',
    week: 2,
    type: 'assignment',
    title: '作业 1 · 复杂度分析',
    body: '完成教材习题。',
    source: { kind: 'in-class', note: '课堂布置' },
    official: false,
    createdBy: { id: 'u-chen', realName: '陈野' },
    createdAt: '2026-09-15T13:00:00+08:00',
    history: [],
    discussionCount: 0,
    ...over,
  };
}

// Tooltip (history indicator) requires a provider ancestor; the real app wraps the tree in one.
const renderNode = (n: TimelineNode) =>
  render(
    <TooltipProvider>
      <TimelineNodeCard node={n} />
    </TooltipProvider>,
  );

describe('TimelineNodeCard', () => {
  it('shows the type, official confirmation, and in-class source for an official assignment', () => {
    renderNode(node({ official: true, dueDate: '2026-09-20T23:59:00+08:00' }));
    expect(screen.getByText('作业')).toBeInTheDocument();
    expect(screen.getByText('官方确认')).toBeInTheDocument();
    expect(screen.getByText('课堂宣布')).toBeInTheDocument(); // SOURCE_LABEL['in-class']
    expect(screen.getByText(/截止/)).toBeInTheDocument();
    expect(screen.queryByText('暂定')).not.toBeInTheDocument();
  });

  it('marks a provisional, student-maintained node and omits the official badge', () => {
    renderNode(
      node({
        type: 'exam',
        title: '期末考试（暂定）',
        official: false,
        dueDate: '2026-12-28T14:00:00+08:00',
        source: { kind: 'student-curated', note: '据往年推测', provisional: true },
      }),
    );
    expect(screen.getByText('考试')).toBeInTheDocument();
    expect(screen.getByText('暂定')).toBeInTheDocument();
    expect(screen.getByText('学生整理')).toBeInTheDocument(); // SOURCE_LABEL['student-curated']
    expect(screen.queryByText('官方确认')).not.toBeInTheDocument();
  });

  it('renders no deadline pill for a node without a due date', () => {
    renderNode(
      node({ type: 'material', title: '讲义', source: { kind: 'student-curated', note: '整理' } }),
    );
    expect(screen.getByText('资料')).toBeInTheDocument();
    expect(screen.queryByText(/截止/)).not.toBeInTheDocument();
    expect(screen.queryByText(/开考/)).not.toBeInTheDocument();
  });

  it('surfaces the read-only edit-history count', () => {
    renderNode(
      node({
        history: [
          {
            id: 'e-1',
            editor: { id: 'u-su', realName: '苏青' },
            editedAt: '2026-10-05T21:12:00+08:00',
            summary: '补充时间',
          },
        ],
      }),
    );
    expect(screen.getByText(/编辑 1 次/)).toBeInTheDocument();
  });
});
