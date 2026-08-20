import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  endOfYear,
  format,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";
import { CATEGORIES, Category, Expense } from "./types";

export type Granularity = "monthly" | "yearly";

export type RangePreset =
  | "last6months"
  | "last12months"
  | "thisYear"
  | "lastYear"
  | "allTime"
  | "custom";

export const RANGE_PRESET_LABELS: Record<RangePreset, string> = {
  last6months: "Last 6 Months",
  last12months: "Last 12 Months",
  thisYear: "This Year",
  lastYear: "Last Year",
  allTime: "All Time",
  custom: "Custom",
};

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

// Stack/legend order chosen so the two color pairs that are hardest to tell
// apart (Entertainment/Transportation and Bills/Food) are never rendered
// adjacent to each other in a stacked chart.
export const CATEGORY_STACK_ORDER: Category[] = [
  "Entertainment",
  "Bills",
  "Shopping",
  "Transportation",
  "Other",
  "Food",
];

export const LINE_DASH_PATTERNS: Record<Category, string | undefined> = {
  Entertainment: undefined,
  Bills: "6 3",
  Shopping: "2 3",
  Transportation: "8 3 2 3",
  Other: "1 4",
  Food: "10 3 2 3 2 3",
};

export function resolveRangePreset(
  preset: RangePreset,
  customStart: string,
  customEnd: string,
  now: Date = new Date()
): DateRange {
  switch (preset) {
    case "last6months":
      return { start: startOfMonth(subMonths(now, 5)), end: endOfMonth(now) };
    case "last12months":
      return {
        start: startOfMonth(subMonths(now, 11)),
        end: endOfMonth(now),
      };
    case "thisYear":
      return { start: startOfYear(now), end: endOfYear(now) };
    case "lastYear": {
      const lastYear = subYears(now, 1);
      return { start: startOfYear(lastYear), end: endOfYear(lastYear) };
    }
    case "allTime":
      return { start: null, end: null };
    case "custom": {
      const start = customStart ? parseISO(customStart) : null;
      const end = customEnd ? parseISO(customEnd) : null;
      if (start && end && start > end) {
        return { start: end, end: start };
      }
      return { start, end };
    }
  }
}

export function isWithinRange(dateStr: string, range: DateRange): boolean {
  const date = parseISO(dateStr);
  if (range.start && date < range.start) return false;
  if (range.end && date > range.end) return false;
  return true;
}

export function filterExpensesByRange(
  expenses: Expense[],
  range: DateRange
): Expense[] {
  return expenses.filter((e) => isWithinRange(e.date, range));
}

/** Resolves null (open) bounds to concrete dates using the actual data. */
function effectiveBounds(
  expenses: Expense[],
  range: DateRange,
  now: Date = new Date()
): { start: Date; end: Date } {
  let start = range.start;
  let end = range.end;
  if (!start || !end) {
    const dates = expenses.map((e) => parseISO(e.date));
    if (!start) {
      start = dates.length
        ? dates.reduce((min, d) => (d < min ? d : min), dates[0])
        : startOfMonth(subMonths(now, 5));
    }
    if (!end) {
      end = dates.length
        ? dates.reduce((max, d) => (d > max ? d : max), dates[0])
        : now;
      if (end < now) end = now;
    }
  }
  return { start, end };
}

/** Range spans at least ~13 months, so a yearly bucket view is meaningful. */
export function spansMultipleYears(
  expenses: Expense[],
  range: DateRange
): boolean {
  const { start, end } = effectiveBounds(expenses, range);
  return differenceInCalendarDays(end, start) >= 395;
}

export interface TrendBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
  total: number;
  byCategory: Record<Category, number>;
}

function emptyCategoryRecord(): Record<Category, number> {
  return CATEGORIES.reduce((acc, c) => {
    acc[c] = 0;
    return acc;
  }, {} as Record<Category, number>);
}

export function buildTrendBuckets(
  expenses: Expense[],
  granularity: Granularity,
  range: DateRange,
  now: Date = new Date()
): TrendBucket[] {
  const { start, end } = effectiveBounds(expenses, range, now);

  const bucketStarts =
    granularity === "monthly"
      ? eachMonthOfInterval({ start, end })
      : eachYearOfInterval({ start, end });

  const buckets: TrendBucket[] = bucketStarts.map((bStart) => {
    const bEnd =
      granularity === "monthly" ? endOfMonth(bStart) : endOfYear(bStart);
    return {
      key: format(bStart, granularity === "monthly" ? "yyyy-MM" : "yyyy"),
      label: format(bStart, granularity === "monthly" ? "MMM yyyy" : "yyyy"),
      start: bStart,
      end: bEnd,
      total: 0,
      byCategory: emptyCategoryRecord(),
    };
  });

  for (const e of expenses) {
    const d = parseISO(e.date);
    if (range.start && d < range.start) continue;
    if (range.end && d > range.end) continue;
    const key = format(d, granularity === "monthly" ? "yyyy-MM" : "yyyy");
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) {
      bucket.total += e.amount;
      bucket.byCategory[e.category] += e.amount;
    }
  }

  return buckets;
}

export interface RangeStats {
  total: number;
  count: number;
  avgPerDay: number;
  avgTransaction: number;
  topCategory: { category: Category; amount: number; share: number } | null;
  biggestExpense: Expense | null;
}

export function computeRangeStats(
  expenses: Expense[],
  range: DateRange,
  now: Date = new Date()
): RangeStats {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
  const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topEntry
    ? {
        category: topEntry[0] as Category,
        amount: topEntry[1],
        share: total > 0 ? topEntry[1] / total : 0,
      }
    : null;

  const biggestExpense = expenses.reduce<Expense | null>((max, e) => {
    if (!max || e.amount > max.amount) return e;
    return max;
  }, null);

  const { start, end } = effectiveBounds(expenses, range, now);
  const days = Math.max(1, differenceInCalendarDays(end, start) + 1);

  return {
    total,
    count,
    avgPerDay: total / days,
    avgTransaction: count > 0 ? total / count : 0,
    topCategory,
    biggestExpense,
  };
}

export interface PeriodComparison {
  currentLabel: string;
  previousLabel: string;
  currentTotal: number;
  previousTotal: number;
  pctChange: number | null;
}

/** Compares the last two buckets of a trend series (e.g. this month vs last). */
export function computePeriodComparison(
  buckets: TrendBucket[]
): PeriodComparison | null {
  if (buckets.length < 2) return null;
  const current = buckets[buckets.length - 1];
  const previous = buckets[buckets.length - 2];
  const pctChange =
    previous.total > 0
      ? ((current.total - previous.total) / previous.total) * 100
      : current.total > 0
        ? null
        : 0;
  return {
    currentLabel: current.label,
    previousLabel: previous.label,
    currentTotal: current.total,
    previousTotal: previous.total,
    pctChange,
  };
}

export interface CategoryMover {
  category: Category;
  currentAmount: number;
  previousAmount: number;
  pctChange: number | null;
  isNew: boolean;
}

/** Finds the category with the largest increase between the last two buckets. */
export function computeFastestMovingCategory(
  buckets: TrendBucket[]
): CategoryMover | null {
  if (buckets.length < 2) return null;
  const current = buckets[buckets.length - 1];
  const previous = buckets[buckets.length - 2];

  let best: CategoryMover | null = null;
  for (const category of CATEGORIES) {
    const currentAmount = current.byCategory[category];
    const previousAmount = previous.byCategory[category];
    if (currentAmount <= previousAmount) continue;
    const pctChange =
      previousAmount > 0
        ? ((currentAmount - previousAmount) / previousAmount) * 100
        : null;
    const delta = currentAmount - previousAmount;
    const bestDelta = best ? best.currentAmount - best.previousAmount : -1;
    if (delta > bestDelta) {
      best = {
        category,
        currentAmount,
        previousAmount,
        pctChange,
        isNew: previousAmount === 0,
      };
    }
  }
  return best;
}

export function buildExportFilename(range: DateRange, now: Date = new Date()) {
  const fmt = (d: Date) => format(d, "yyyy-MM-dd");
  const start = range.start ? fmt(range.start) : "start";
  const end = range.end ? fmt(range.end) : fmt(now);
  return `expenses_${start}_to_${end}.csv`;
}
