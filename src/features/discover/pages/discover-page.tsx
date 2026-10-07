import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';

export function DiscoverPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">选课 × 评课</h1>
        <p className="text-muted-foreground mt-1">
          课程搜索、历年成绩分布、评价聚合与可视化排课（Schedule Builder）。选课不靠玄学。
        </p>
      </header>
      <EmptyState
        Icon={Compass}
        title="选课评课即将上线"
        description="这里会接入课程档案页——历年成绩分布与评价聚合将用图表呈现（dataviz），并提供可视化排课与冲突检测。"
      />
    </div>
  );
}
