const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDateKeyFromParts(year: number, month: number, day: number) {
  return toDateKey(new Date(year, month, day));
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const match = DATE_KEY_PATTERN.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isIsoDateTime(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

export function formatDateTimeLabel(dateKey: string, isoDateTime: string) {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return dateKey;

  const hours = date.getHours();
  const period = hours < 12 ? 'AM' : 'PM';
  const hours12 = String(hours % 12 || 12).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateKey} ${period} ${hours12}:${minutes}`;
}

export function getTimeOfDayEmoji(isoDateTime: string) {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return '🌙';

  const hours = date.getHours();
  return hours >= 6 && hours < 18 ? '☀️' : '🌙';
}
