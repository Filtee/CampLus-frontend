import { Users } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';

export function OrgsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">组织与社团</h1>
        <p className="text-muted-foreground mt-1">
          每个社团一个公开主页，发布活动与公告。不用加群才能了解。
        </p>
      </header>
      <EmptyState
        Icon={Users}
        title="组织社团即将上线"
        description="组织公开主页、活动管理与公告发布。活动是离散条目，不复用课程 Timeline 结构。"
      />
    </div>
  );
}
