import type { TaskItem, ScheduleBlock } from './types';

// All planner dates are LOCAL calendar dates (YYYY-MM-DD) computed on the device.
// Never use toISOString() for this — it converts to UTC and shifts the day in Nepal (UTC+5:45).

export const PRIORITY_RANK: Record<TaskItem['priority'], number> = { urgent: 0, high: 1, medium: 2, low: 3 };
export const PRIORITY_LABEL: Record<TaskItem['priority'], string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
export const RECUR_LABEL: Record<TaskItem['recurring'], string> = {
  none: 'Once',
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekly: 'Weekly',
};

export function toLocalDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(dateStr: string, n: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + n);
  return toLocalDateStr(d);
}

export function timeToMinutes(t?: string): number {
  if (!t) return -1;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return -1;
  return h * 60 + (m || 0);
}

export function minutesNow(d: Date = new Date()): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function formatTime(t?: string): string {
  const mins = timeToMinutes(t);
  if (mins < 0) return t || '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function formatDateLabel(dateStr: string | undefined, today: string): string {
  if (!dateStr) return '';
  if (dateStr === today) return 'Today';
  if (dateStr === addDays(today, 1)) return 'Tomorrow';
  if (dateStr === addDays(today, -1)) return 'Yesterday';
  return parseLocalDate(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function toggleDate(dates: string[] = [], date: string): string[] {
  return dates.includes(date) ? dates.filter((d) => d !== date) : [...dates, date];
}

/** Current streak stays alive if today isn't checked yet but yesterday was. */
export function calculateStreaks(dates: string[] = [], today: string): { current: number; best: number } {
  const set = new Set(dates);
  let current = 0;
  let cursor = set.has(today) ? today : addDays(today, -1);
  while (set.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of Array.from(set).sort()) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best: Math.max(best, current) };
}

export function isTaskRecurring(task: Pick<TaskItem, 'recurring'>): boolean {
  return !!task.recurring && task.recurring !== 'none';
}

export function isTaskScheduledOn(task: TaskItem, date: string): boolean {
  if (!isTaskRecurring(task)) return true;
  const start = task.dueDate || (task.createdAt ? toLocalDateStr(new Date(task.createdAt)) : '');
  if (start && date < start) return false;
  const dow = parseLocalDate(date).getDay();
  if (task.recurring === 'weekdays') return dow >= 1 && dow <= 5;
  if (task.recurring === 'weekly') return start ? parseLocalDate(start).getDay() === dow : true;
  return true; // daily
}

export function isTaskDoneOn(task: TaskItem, date: string): boolean {
  return isTaskRecurring(task) ? (task.completedDates || []).includes(date) : task.status === 'completed';
}

export function isBlockOnDate(block: ScheduleBlock, date: string): boolean {
  if (block.specificDate) return block.specificDate === date;
  const days = block.daysOfWeek || [];
  if (days.length === 0) return true;
  return days.includes(parseLocalDate(date).getDay());
}

/** Whitelist update fields so clients can't overwrite _id / id / timestamps. */
export function pickFields(body: unknown, allowed: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!body || typeof body !== 'object') return out;
  for (const key of allowed) {
    if (key in (body as Record<string, unknown>)) out[key] = (body as Record<string, unknown>)[key];
  }
  return out;
}

export const TASK_FIELDS = [
  'title', 'description', 'priority', 'status', 'category', 'dueDate', 'dueTime', 'subtasks',
  'estimatedMinutes', 'actualMinutes', 'recurring', 'completedAt', 'completedDates', 'order',
] as const;
export const HABIT_FIELDS = [
  'title', 'emoji', 'category', 'targetDaysPerWeek', 'timeOfDay', 'completedDates', 'archived', 'order',
] as const;
export const BLOCK_FIELDS = [
  'title', 'startTime', 'endTime', 'type', 'description', 'daysOfWeek', 'specificDate', 'completedDates', 'color', 'order',
] as const;
export const NOTE_FIELDS = ['title', 'content', 'category', 'pinned', 'color', 'tags', 'order'] as const;
