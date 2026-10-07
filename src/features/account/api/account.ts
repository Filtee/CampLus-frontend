import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/http';
import type { User } from '@/types';

// 当前登录用户（实名身份，原则 1）。被共享的 AppShell 复用。
export const fetchMe = () => get<User>('/api/me');

export const useMe = () => useQuery({ queryKey: ['me'], queryFn: fetchMe });
