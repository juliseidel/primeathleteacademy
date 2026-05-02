/**
 * Local-time date helpers — alle Datums-Operationen passieren in der
 * lokalen Zeitzone des Geräts. Wir nutzen NIEMALS toISOString() für
 * date-only Strings, weil das UTC ist und in MESZ einen Tag früher zurückkommt.
 */

export function localIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayLocalIso(): string {
  return localIso(new Date());
}

export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday-anchored
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(d.getDate() + days);
  return next;
}
