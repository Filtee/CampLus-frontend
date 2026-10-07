import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  src?: string;
  className?: string;
}

// 取姓名末两字作 fallback（中文名友好）
function initials(name: string): string {
  const trimmed = name.trim();
  return trimmed.length <= 2 ? trimmed : trimmed.slice(-2);
}

export function UserAvatar({ name, src, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('size-8', className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
