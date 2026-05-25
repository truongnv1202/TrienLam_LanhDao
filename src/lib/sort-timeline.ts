import type { TimelineEvent } from "@/types";

export function sortTimelineEventsNewestFirst(events: TimelineEvent[]): TimelineEvent[] {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => {
      const dateDiff = getTimelineSortKey(b.event) - getTimelineSortKey(a.event);
      return dateDiff || a.index - b.index;
    })
    .map(({ event }) => event);
}

function getTimelineSortKey(item: TimelineEvent): number {
  const text = `${item.year} ${item.event} ${item.description}`;
  if (/\b(nay|hiện nay|tu nay|từ nay)\b/i.test(normalizeText(text))) {
    return Number.MAX_SAFE_INTEGER;
  }

  const fullDates = [...text.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g)].map(
    (match) => ({
      day: Number(match[1]),
      month: Number(match[2]),
      year: Number(match[3]),
    })
  );
  if (fullDates.length > 0) {
    return Math.max(...fullDates.map(({ year, month, day }) => year * 10000 + month * 100 + day));
  }

  const monthYears = [...text.matchAll(/\b(\d{1,2})\/(\d{4})\b/g)].map((match) => ({
    month: Number(match[1]),
    year: Number(match[2]),
  }));
  if (monthYears.length > 0) {
    return Math.max(...monthYears.map(({ year, month }) => year * 10000 + month * 100));
  }

  const years = [...text.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => Number(match[0]));
  if (years.length > 0) return Math.max(...years) * 10000;

  return 0;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
