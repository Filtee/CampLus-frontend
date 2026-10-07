import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiscussions } from '@/features/courses/api/courses';
import { formatDateTime } from '@/lib/format';

// 节点讨论：依附于具体节点，不提供脱离上下文的自由发帖（设计原则 3）；实名展示（原则 1）
export function NodeDiscussions({ nodeId }: { nodeId: string }) {
  const { data, isLoading } = useDiscussions(nodeId);

  return (
    <div className="border-border mt-4 border-t pt-4">
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((d) => (
            <li key={d.id} className="flex gap-3">
              <UserAvatar name={d.author.realName} src={d.author.avatarUrl} className="size-8" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{d.author.realName}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDateTime(d.createdAt)}
                  </span>
                </div>
                <p className="text-foreground/90 mt-0.5 text-sm leading-relaxed">{d.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">还没有讨论。围绕这个节点提出第一个问题。</p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <input
          disabled
          placeholder="以实名发表讨论…（接入后端后开放）"
          className="border-input bg-muted/40 text-muted-foreground h-9 flex-1 rounded-lg border px-3 text-sm outline-none"
        />
        <Button size="sm" disabled>
          发表
        </Button>
      </div>
    </div>
  );
}
