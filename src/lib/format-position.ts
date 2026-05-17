/** Chuẩn hóa & sắp xếp dòng chức vụ: mới nhất → cũ nhất (theo năm trong ngoặc) */
export function formatPositionNewestFirst(text: string): string {
  const normalized = text
    .replace(/\s*\|\s*/g, "\n")
    .replace(/;\s*/g, "\n")
    .replace(/\r\n/g, "\n");

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line, index) => ({ line, index, year: extractPositionYear(line) }))
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return a.index - b.index;
    })
    .map(({ line }) => line)
    .join("\n");
}

function extractPositionYear(line: string): number {
  if (/\bNay\b/i.test(line)) return 9999;

  const rangeEnd = line.match(/\((\d{4})\s*[-–]\s*(\d{4}|Nay)\)/i);
  if (rangeEnd) {
    const end = rangeEnd[2];
    if (/Nay/i.test(end)) return 9999;
    return parseInt(end, 10);
  }

  const monthYear = line.match(/\((\d{1,2})\/(\d{4})\)/);
  if (monthYear) return parseInt(monthYear[2], 10);

  const year = line.match(/\((\d{4})\)/);
  if (year) return parseInt(year[1], 10);

  const khóa = line.match(/khóa\s+([XIVLCĐ]+)/i);
  if (khóa) return romanKhóaToSortValue(khóa[1]);

  return 0;
}

function romanKhóaToSortValue(roman: string): number {
  const map: Record<string, number> = {
    XIII: 2013,
    XII: 2011,
    XI: 2006,
    X: 2001,
    IX: 1996,
    VIII: 1991,
    VII: 1986,
  };
  return map[roman.toUpperCase()] ?? 0;
}
