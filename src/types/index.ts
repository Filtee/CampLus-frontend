// CampLus 领域模型 —— 从 docs/产品定义.md 派生
// 后端接入时，这些类型即契约；mock 与真实 API 返回同构数据。

export type UserRole = 'student' | 'maintainer' | 'teacher';

export interface User {
  id: string;
  realName: string; // 实名（原则 1）：平台无匿名
  studentId: string;
  department: string;
  avatarUrl?: string;
  role: UserRole;
}

export type CourseCategory = '通识必修' | '专业必修' | '专业选修' | '公共选修';

export interface Course {
  id: string;
  code: string; // 如 CS101
  name: string;
  department: string;
  credits: number;
  category: CourseCategory;
  description?: string;
}

export interface Semester {
  id: string;
  courseId: string;
  term: string; // "2026 春"
  teacher: string;
  weeks: number; // 教学周数
  enrolledCount: number;
  isCurrent: boolean; // 当前学期活跃，历史学期只读归档
  maintainers?: Pick<User, 'id' | 'realName'>[]; // 课程维护者（原则 4：权力即责任）
}

export type NodeType = 'announcement' | 'assignment' | 'exam' | 'material' | 'milestone';

// 信息来源标注（原则 4：责任可追溯）
export type NodeSourceKind = 'in-class' | 'student-curated' | 'syllabus';

export interface NodeSource {
  kind: NodeSourceKind;
  note: string; // "课堂宣布" / "学生整理，据课程大纲"
  announcedAt?: string; // ISO，信息最初产生的时间
  provisional?: boolean; // 暂定 / 待确认（如尚未官方确认的考试时间）
}

export interface EditRecord {
  id: string;
  editor: Pick<User, 'id' | 'realName'>;
  editedAt: string; // ISO
  summary: string; // 修改说明（原则 4：合并必须记录理由）
}

export interface TimelineNode {
  id: string;
  semesterId: string;
  week: number;
  type: NodeType;
  title: string;
  body: string;
  dueDate?: string; // ISO，作业/考试的截止或举行时间
  source: NodeSource;
  official: boolean; // 教师标注的「官方确认」（可选，非必要环节）
  createdBy: Pick<User, 'id' | 'realName'>;
  createdAt: string; // ISO
  history: EditRecord[];
  discussionCount: number;
}

export interface Discussion {
  id: string;
  nodeId: string; // 讨论依附于节点（原则 3：不脱离上下文）
  author: Pick<User, 'id' | 'realName' | 'avatarUrl'>;
  body: string;
  createdAt: string; // ISO
}

// 课程列表 / 个人首页用的聚合视图
export interface CourseSummary {
  course: Course;
  currentSemester: Semester;
  nextDue?: { nodeId: string; title: string; type: NodeType; dueDate: string };
  weekHighlights: number; // 本周节点数
}

// 课程浏览（目录）视图：覆盖「本学期未开课」的课程，故 currentSemester 可空
export interface CourseCatalogItem {
  course: Course;
  currentSemester?: Semester; // 无 → 本学期未开课（只有历史归档）
  terms: string[]; // 该课开设过的所有学期（新 → 旧），用于按学期筛选
  termCount: number; // 已开设 / 归档的学期数
  nextDue?: { nodeId: string; title: string; type: NodeType; dueDate: string };
  lastUpdatedAt?: string; // 当前学期内容的最近更新时间（ISO）
}
