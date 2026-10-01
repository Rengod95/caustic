// ISO date helpers for Calendar and DatePicker. Dates are 'YYYY-MM-DD' strings, months 'YYYY-MM'.
// All arithmetic runs in UTC so results never depend on the viewer's time zone.

export type IsoDate = string;
export interface DateRange { from: IsoDate; to?: IsoDate }
export type DateValue = IsoDate | DateRange;

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function parseIso(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIso(d: Date): IsoDate {
  return `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const monthOf = (iso: IsoDate) => iso.slice(0, 7);

export function todayIso(): IsoDate {
  const d = new Date();
  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(iso: IsoDate, n: number): IsoDate {
  const d = parseIso(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d);
}

export const daysInMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number) as [number, number];
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};

export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const t = y * 12 + (m - 1) + n;
  return `${pad(Math.floor(t / 12), 4)}-${pad((t % 12) + 1)}`;
}

/** Same day in another month; clamped to the last day when the target month is shorter. */
export function shiftMonth(iso: IsoDate, n: number): IsoDate {
  const month = addMonths(monthOf(iso), n);
  return `${month}-${pad(Math.min(Number(iso.slice(8, 10)), daysInMonth(month)))}`;
}

export const firstOfMonth = (month: string): IsoDate => `${month}-01`;
export const lastOfMonth = (month: string): IsoDate => `${month}-${pad(daysInMonth(month))}`;
/** 0 = Sunday. */
export const weekday = (iso: IsoDate) => parseIso(iso).getUTCDay();

export function normalizeRange(a: IsoDate, b: IsoDate): DateRange {
  return a <= b ? { from: a, to: b } : { from: b, to: a };
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts });
export const formatMonthTitle = (month: string) => fmt({ month: 'long', year: 'numeric' }).format(parseIso(firstOfMonth(month)));
export const formatLongDate = (iso: IsoDate) => fmt({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(parseIso(iso));
export const formatShort = (iso: IsoDate, year = true) => fmt(year ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' }).format(parseIso(iso));
export const weekdayNames = () => [0, 1, 2, 3, 4, 5, 6].map(i => fmt({ weekday: 'long' }).format(new Date(Date.UTC(2026, 0, 4 + i))));

/** “Oct 8 – Oct 14, 2026”, or “Oct 8, 2026 – Jan 3, 2027” when the years differ; a single date for from = to. */
export function formatValue(value: DateValue | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return formatShort(value);
  if (!value.to || value.to === value.from) return formatShort(value.from);
  const sameYear = value.from.slice(0, 4) === value.to.slice(0, 4);
  return `${formatShort(value.from, !sameYear)} – ${formatShort(value.to)}`;
}
