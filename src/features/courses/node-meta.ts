import { BookOpen, ClipboardList, Flag, Megaphone, SquareCheckBig } from 'lucide-react';
import type { NodeSourceKind, NodeType } from '@/types';
import type { LucideIcon } from 'lucide-react';

// Timeline 五类节点的视觉元信息。
// 注意：class 必须是完整静态字符串，Tailwind v4 才能在扫描时识别——
// 不要用 `bg-${token}` 这种动态拼接。
export interface NodeMeta {
  label: string;
  Icon: LucideIcon;
  dot: string; // 时间轴圆点实色
  chip: string; // 类型徽章：淡底 + 文字 + 描边
  accent: string; // 强调文字色
  rail: string; // 卡片左侧色条
}

export const NODE_META: Record<NodeType, NodeMeta> = {
  announcement: {
    label: '公告',
    Icon: Megaphone,
    dot: 'bg-node-announcement',
    chip: 'bg-node-announcement/10 text-node-announcement border-node-announcement/20',
    accent: 'text-node-announcement',
    rail: 'bg-node-announcement',
  },
  assignment: {
    label: '作业',
    Icon: ClipboardList,
    dot: 'bg-node-assignment',
    chip: 'bg-node-assignment/10 text-node-assignment border-node-assignment/20',
    accent: 'text-node-assignment',
    rail: 'bg-node-assignment',
  },
  exam: {
    label: '考试',
    Icon: SquareCheckBig,
    dot: 'bg-node-exam',
    chip: 'bg-node-exam/10 text-node-exam border-node-exam/20',
    accent: 'text-node-exam',
    rail: 'bg-node-exam',
  },
  material: {
    label: '资料',
    Icon: BookOpen,
    dot: 'bg-node-material',
    chip: 'bg-node-material/10 text-node-material border-node-material/20',
    accent: 'text-node-material',
    rail: 'bg-node-material',
  },
  milestone: {
    label: '里程碑',
    Icon: Flag,
    dot: 'bg-node-milestone',
    chip: 'bg-node-milestone/10 text-node-milestone border-node-milestone/20',
    accent: 'text-node-milestone',
    rail: 'bg-node-milestone',
  },
};

export const SOURCE_LABEL: Record<NodeSourceKind, string> = {
  'in-class': '课堂宣布',
  'student-curated': '学生整理',
  syllabus: '课程大纲',
};
