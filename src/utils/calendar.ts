import type { MoodEntry } from '@/types/mood';

export type CalendarMonth = {
  month: number;
  year: number;
};

export type CalendarDay = CalendarMonth & {
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
};

const CALENDAR_CELL_COUNT = 42;

function toDateKeyFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCalendarMonth(date: Date): CalendarMonth {
  return { month: date.getMonth(), year: date.getFullYear() };
}

export function getCalendarMonthFromDateKey(dateKey: string): CalendarMonth {
  const [year, month] = dateKey.split('-').map(Number);
  return { month: month - 1, year };
}

export function getFirstDateKey({ month, year }: CalendarMonth) {
  return `${year}-${String(month + 1).padStart(2, '0')}-01`;
}

export function isSameCalendarMonth(a: CalendarMonth, b: CalendarMonth) {
  return a.month === b.month && a.year === b.year;
}

export function groupMoodEntriesByDate(entries: readonly MoodEntry[]) {
  const entriesByDate = entries.reduce<Map<string, MoodEntry[]>>((result, entry) => {
    const dateEntries = result.get(entry.date);
    if (dateEntries) dateEntries.push(entry);
    else result.set(entry.date, [entry]);
    return result;
  }, new Map());

  for (const dateEntries of entriesByDate.values()) {
    dateEntries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  return entriesByDate;
}

export function getDaysInMonth({ month, year }: CalendarMonth) {
  return new Date(year, month + 1, 0).getDate();
}

export function moveCalendarMonth(current: CalendarMonth, offset: number): CalendarMonth {
  const nextMonth = new Date(current.year, current.month + offset, 1);
  return getCalendarMonth(nextMonth);
}

export function createCalendarDays(current: CalendarMonth): CalendarDay[] {
  const firstDayOfWeek = new Date(current.year, current.month, 1).getDay();

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) => {
    const date = new Date(current.year, current.month, index - firstDayOfWeek + 1);
    const month = date.getMonth();
    const year = date.getFullYear();

    return {
      dateKey: toDateKeyFromDate(date),
      day: date.getDate(),
      isCurrentMonth: month === current.month && year === current.year,
      month,
      year,
    };
  });
}
