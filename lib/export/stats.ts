import { Expense } from "@/lib/types";
import { ExportStats, CategoryBreakdown } from "./types";

export function computeExportStats(expenses: Expense[]): ExportStats {
  if (expenses.length === 0) {
    return {
      count: 0,
      total: 0,
      average: 0,
      earliestDate: null,
      latestDate: null,
      byCategory: [],
    };
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategoryMap = expenses.reduce<Record<string, CategoryBreakdown>>(
    (acc, e) => {
      const existing = acc[e.category] ?? {
        category: e.category,
        count: 0,
        total: 0,
      };
      existing.count += 1;
      existing.total += e.amount;
      acc[e.category] = existing;
      return acc;
    },
    {}
  );

  const dates = expenses.map((e) => e.date).sort();

  return {
    count: expenses.length,
    total,
    average: total / expenses.length,
    earliestDate: dates[0],
    latestDate: dates[dates.length - 1],
    byCategory: Object.values(byCategoryMap).sort((a, b) => b.total - a.total),
  };
}
