import { delay, http, HttpResponse } from 'msw';
import type { Course, CourseCatalogItem, CourseSummary, TimelineNode } from '@/types';
import { courses, currentUser, discussions, nodes, semesters } from './data';

// 秋季学期统一开学日，用于推算「当前教学周」
const FALL_START = new Date('2026-09-08T00:00:00+08:00');

function currentWeek(now: Date = new Date()): number {
  const diff = now.getTime() - FALL_START.getTime();
  return Math.max(1, Math.floor(diff / (7 * 86_400_000)) + 1);
}

function sortTimeline(list: TimelineNode[]): TimelineNode[] {
  return [...list].sort((a, b) => a.week - b.week || a.createdAt.localeCompare(b.createdAt));
}

function buildSummary(courseId: string): CourseSummary | null {
  const course = courses.find((c) => c.id === courseId);
  const currentSemester = semesters.find((s) => s.courseId === courseId && s.isCurrent);
  if (!course || !currentSemester) return null;

  const semNodes = nodes.filter((n) => n.semesterId === currentSemester.id);
  const now = new Date();
  const week = currentWeek(now);

  const upcoming = semNodes
    .filter((n) => n.dueDate && new Date(n.dueDate) >= now)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));
  const next = upcoming[0];

  return {
    course,
    currentSemester,
    nextDue: next
      ? { nodeId: next.id, title: next.title, type: next.type, dueDate: next.dueDate! }
      : undefined,
    weekHighlights: semNodes.filter((n) => n.week === week).length,
  };
}

function soonestDue(semesterId: string, now: Date): CourseCatalogItem['nextDue'] {
  const next = nodes
    .filter((n) => n.semesterId === semesterId && n.dueDate && new Date(n.dueDate) >= now)
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))[0];
  return next
    ? { nodeId: next.id, title: next.title, type: next.type, dueDate: next.dueDate! }
    : undefined;
}

// Latest content change in a semester: newest of any node's creation or edit timestamp.
function latestUpdate(semesterId: string): string | undefined {
  const times = nodes
    .filter((n) => n.semesterId === semesterId)
    .flatMap((n) => [n.createdAt, ...n.history.map((h) => h.editedAt)]);
  return times.sort().at(-1);
}

function buildCatalogItem(course: Course): CourseCatalogItem {
  const courseSemesters = semesters.filter((s) => s.courseId === course.id);
  const current = courseSemesters.find((s) => s.isCurrent);
  return {
    course,
    currentSemester: current,
    terms: courseSemesters.map((s) => s.term).sort((a, b) => b.localeCompare(a)),
    termCount: courseSemesters.length,
    nextDue: current ? soonestDue(current.id, new Date()) : undefined,
    lastUpdatedAt: current ? latestUpdate(current.id) : undefined,
  };
}

export const handlers = [
  http.get('/api/me', async () => {
    await delay(200);
    return HttpResponse.json(currentUser);
  }),

  http.get('/api/courses', async () => {
    await delay(500);
    const summaries = courses.map((c) => buildSummary(c.id)).filter(Boolean);
    return HttpResponse.json(summaries);
  }),

  // Browse/catalog: every course, including those with no current offering.
  // Declared before '/api/courses/:courseId' so 'catalog' is not read as an id.
  http.get('/api/courses/catalog', async () => {
    await delay(500);
    return HttpResponse.json(courses.map(buildCatalogItem));
  }),

  http.get('/api/courses/:courseId', async ({ params }) => {
    await delay(400);
    const course = courses.find((c) => c.id === params.courseId);
    if (!course) return new HttpResponse(null, { status: 404 });
    const courseSemesters = semesters
      .filter((s) => s.courseId === course.id)
      .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent) || b.term.localeCompare(a.term));
    return HttpResponse.json({ course, semesters: courseSemesters });
  }),

  http.get('/api/semesters/:semesterId/timeline', async ({ params }) => {
    await delay(600);
    const list = sortTimeline(nodes.filter((n) => n.semesterId === params.semesterId));
    return HttpResponse.json(list);
  }),

  http.get('/api/nodes/:nodeId/discussions', async ({ params }) => {
    await delay(300);
    const list = discussions
      .filter((d) => d.nodeId === params.nodeId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return HttpResponse.json(list);
  }),
];
