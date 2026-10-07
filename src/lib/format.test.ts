import { describe, expect, it } from 'vitest';
import { dueUrgency, relativeDays } from '@/lib/format';

// Fixed reference "now" built in local time so day-boundary math is deterministic across
// machine time zones. `at` produces ISO strings the same way the app consumes them.
const now = new Date(2026, 9, 6, 12, 0, 0); // 2026-10-06 12:00 local
const at = (year: number, monthIndex: number, day: number, hour = 12) =>
  new Date(year, monthIndex, day, hour, 0, 0).toISOString();

describe('relativeDays', () => {
  it('labels today, tomorrow, and yesterday by calendar day', () => {
    expect(relativeDays(at(2026, 9, 6, 20), now)).toBe('今天');
    expect(relativeDays(at(2026, 9, 7, 8), now)).toBe('明天');
    expect(relativeDays(at(2026, 9, 5, 23), now)).toBe('昨天');
  });

  it('counts whole days in both directions', () => {
    expect(relativeDays(at(2026, 9, 9), now)).toBe('3 天后');
    expect(relativeDays(at(2026, 9, 3), now)).toBe('3 天前');
  });
});

describe('dueUrgency', () => {
  it('classifies overdue, soon (within 3 days), and upcoming', () => {
    expect(dueUrgency(at(2026, 9, 6, 9), now)).toBe('overdue');
    expect(dueUrgency(at(2026, 9, 7, 12), now)).toBe('soon');
    expect(dueUrgency(at(2026, 9, 20), now)).toBe('upcoming');
  });
});
