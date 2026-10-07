import { Bell } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';

export function NoticesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">行政通知聚合</h1>
        <p className="text-muted-foreground mt-1">
          学生把各处的行政通知搬运、录入到平台，按来源和类别整理。不用在 QQ 群里考古。
        </p>
      </header>
      <EmptyState
        Icon={Bell}
        title="行政通知聚合即将上线"
        description="任何同学都可以录入一条通知并标注来源，其他人补充、纠错。按学院/教务处/类别结构化浏览，而非时间流。"
      />
    </div>
  );
}
