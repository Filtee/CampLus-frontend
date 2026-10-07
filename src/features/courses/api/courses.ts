import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/http';
import type {
  Course,
  CourseCatalogItem,
  CourseSummary,
  Discussion,
  Semester,
  TimelineNode,
} from '@/types';

export interface CourseDetail {
  course: Course;
  semesters: Semester[];
}

export const courseApi = {
  list: () => get<CourseSummary[]>('/api/courses'),
  catalog: () => get<CourseCatalogItem[]>('/api/courses/catalog'),
  detail: (id: string) => get<CourseDetail>(`/api/courses/${id}`),
  timeline: (semesterId: string) => get<TimelineNode[]>(`/api/semesters/${semesterId}/timeline`),
  discussions: (nodeId: string) => get<Discussion[]>(`/api/nodes/${nodeId}/discussions`),
};

export const courseKeys = {
  list: ['courses'] as const,
  catalog: ['courses', 'catalog'] as const,
  detail: (id: string) => ['course', id] as const,
  timeline: (semesterId: string) => ['timeline', semesterId] as const,
  discussions: (nodeId: string) => ['discussions', nodeId] as const,
};

export const useCourses = () => useQuery({ queryKey: courseKeys.list, queryFn: courseApi.list });

export const useCourseCatalog = () =>
  useQuery({ queryKey: courseKeys.catalog, queryFn: courseApi.catalog });

export const useCourse = (id: string) =>
  useQuery({ queryKey: courseKeys.detail(id), queryFn: () => courseApi.detail(id) });

export const useTimeline = (semesterId: string | undefined) =>
  useQuery({
    queryKey: courseKeys.timeline(semesterId ?? ''),
    queryFn: () => courseApi.timeline(semesterId!),
    enabled: Boolean(semesterId),
  });

export const useDiscussions = (nodeId: string, enabled = true) =>
  useQuery({
    queryKey: courseKeys.discussions(nodeId),
    queryFn: () => courseApi.discussions(nodeId),
    enabled,
  });
