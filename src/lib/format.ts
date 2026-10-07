// 轻量日期/时间格式化 —— 全站统一口径，避免各处散写 Intl

const dateFmt = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
});

const dateTimeFmt = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

/** 相对今天的人类可读描述：3 天后 / 今天 / 2 天前 */
export function relativeDays(iso: string, now: Date = new Date()): string {
  const target = new Date(iso);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (diffDays > 0) return `${diffDays} 天后`;
  return `${-diffDays} 天前`;
}

/** 截止时间的紧迫度：决定视觉强调（逾期 / 临近 / 从容） */
export type DueUrgency = 'overdue' | 'soon' | 'upcoming';

export function dueUrgency(iso: string, now: Date = new Date()): DueUrgency {
  const diffMs = new Date(iso).getTime() - now.getTime();
  if (diffMs < 0) return 'overdue';
  if (diffMs < 3 * 86_400_000) return 'soon';
  return 'upcoming';
}
