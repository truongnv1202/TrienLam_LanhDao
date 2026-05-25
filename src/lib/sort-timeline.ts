import type { TimelineEvent } from "@/types";

export function sortTimelineEventsNewestFirst(events: TimelineEvent[]): TimelineEvent[] {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => {
      const dateDiff = getTimelineSortTimestamp(b.event) - getTimelineSortTimestamp(a.event);
      return dateDiff || a.index - b.index;
    })
    .map(({ event }) => event);
}

function getTimelineSortTimestamp(item: TimelineEvent): number {
  const text = item.year;
  if (/\b(nay|hiện nay|tu nay|từ nay)\b/i.test(normalizeText(text))) {
    return Date.UTC(9999, 11, 31, 23, 59, 59, 999);
  }

  const timestamps: number[] = [];
  const fullDatePattern = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;
  const textWithoutFullDates = text.replace(fullDatePattern, (value, day, month, year) => {
    const timestamp = toTimestamp(Number(year), Number(month), Number(day));
    if (timestamp > 0) timestamps.push(timestamp);
    return " ".repeat(value.length);
  });

  const monthYearPattern = /\b(\d{1,2})\/(\d{4})\b/g;
  const textWithoutMonthYears = textWithoutFullDates.replace(
    monthYearPattern,
    (value, month, year) => {
      const timestamp = toTimestamp(Number(year), Number(month), daysInMonth(Number(year), Number(month)));
      if (timestamp > 0) timestamps.push(timestamp);
      return " ".repeat(value.length);
    }
  );

  for (const match of textWithoutMonthYears.matchAll(/\b(19|20)\d{2}\b/g)) {
    const year = Number(match[0]);
    timestamps.push(toTimestamp(year, 12, 31));
  }

  return timestamps.length > 0 ? Math.max(...timestamps) : 0;
}

function toTimestamp(year: number, month: number, day: number): number {
  if (year < 1900 || year > 9999 || month < 1 || month > 12) return 0;
  const maxDay = daysInMonth(year, month);
  if (day < 1 || day > maxDay) return 0;
  return Date.UTC(year, month - 1, day, 23, 59, 59, 999);
}

function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
