import { endOfMonth, format, parseISO, startOfMonth, subDays } from "date-fns";
import { CATEGORIES, Category, Expense } from "./types";

export interface CategoryTotal {
  category: Category;
  amount: number;
  share: number;
}

export interface MonthlyCategoryBreakdown {
  monthLabel: string;
  total: number;
  categories: CategoryTotal[];
}

export function computeMonthlyCategoryBreakdown(
  expenses: Expense[],
  now: Date = new Date()
): MonthlyCategoryBreakdown {
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const byCategory = new Map<Category, number>();
  let total = 0;

  for (const e of expenses) {
    const d = parseISO(e.date);
    if (d < start || d > end) continue;
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    total += e.amount;
  }

  const categories = CATEGORIES.filter((c) => (byCategory.get(c) ?? 0) > 0)
    .map((category) => {
      const amount = byCategory.get(category) ?? 0;
      return { category, amount, share: total > 0 ? amount / total : 0 };
    })
    .sort((a, b) => b.amount - a.amount);

  return { monthLabel: format(now, "MMMM yyyy"), total, categories };
}

export interface BudgetStreak {
  streakDays: number;
  windowDays: number;
  dailyBudget: number;
}

/**
 * The app has no explicit budget-setting feature, so "budget" here is the
 * user's own trailing-window daily average spend. The streak counts
 * consecutive days ending today, within that window, whose total spend
 * stayed at or under that average.
 */
export function computeBudgetStreak(
  expenses: Expense[],
  now: Date = new Date(),
  windowDays: number = 30
): BudgetStreak {
  if (expenses.length === 0) {
    return { streakDays: 0, windowDays, dailyBudget: 0 };
  }

  const totalsByDay = new Map<string, number>();
  for (const e of expenses) {
    totalsByDay.set(e.date, (totalsByDay.get(e.date) ?? 0) + e.amount);
  }

  let windowTotal = 0;
  for (let i = 0; i < windowDays; i++) {
    const key = format(subDays(now, i), "yyyy-MM-dd");
    windowTotal += totalsByDay.get(key) ?? 0;
  }
  const dailyBudget = windowTotal / windowDays;

  let streakDays = 0;
  for (let i = 0; i < windowDays; i++) {
    const key = format(subDays(now, i), "yyyy-MM-dd");
    const daySpend = totalsByDay.get(key) ?? 0;
    if (daySpend > dailyBudget) break;
    streakDays += 1;
  }

  return { streakDays, windowDays, dailyBudget };
}
