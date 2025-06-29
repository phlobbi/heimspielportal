import type { Match } from "./App";

export function parseCSV(csv: string): Match[] {
  const lines = csv.trim().split('\n');
  const header = lines[0].split(';');
  const resultIdx = header.findIndex(h => h.toLowerCase().includes('match'));
  return lines.slice(1).map(line => {
    const parts = line.split(';');
    const [date, time, home, guest] = parts;
    const result = resultIdx >= 0 ? parts[resultIdx] : undefined;
    return { date, time, home, guest, result };
  });
}

export function isWithinNext7Days(dateStr: string): boolean {
  const [day, month, year] = dateStr.split('.').map(Number);
  const matchDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0,0,0,0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 6);
  return matchDate >= today && matchDate <= in7Days;
}

export function isPast(dateStr: string): boolean {
  const [day, month, year] = dateStr.split('.').map(Number);
  const matchDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0,0,0,0);
  return matchDate < today;
}