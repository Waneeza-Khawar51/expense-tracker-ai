import { format, subDays } from "date-fns";
import { Expense } from "@/lib/types";
import {
  computeBudgetStreak,
  computeMonthlyCategoryBreakdown,
} from "@/lib/monthlyInsights";

const NOW = new Date("2026-08-24T12:00:00");

function makeExpense(overrides: Partial<Expense>): Expense {
  return {
    id: crypto.randomUUID(),
    date: "2026-08-01",
    amount: 10,
    category: "Food",
    description: "test",
    createdAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeMonthlyCategoryBreakdown", () => {
  it("only includes expenses within the given month", () => {
    const expenses: Expense[] = [
      makeExpense({ date: "2026-08-05", amount: 100, category: "Food" }),
      makeExpense({ date: "2026-07-31", amount: 500, category: "Food" }),
      makeExpense({ date: "2026-09-01", amount: 500, category: "Food" }),
    ];

    const result = computeMonthlyCategoryBreakdown(expenses, NOW);

    expect(result.total).toBe(100);
    expect(result.categories).toEqual([
      { category: "Food", amount: 100, share: 1 },
    ]);
  });

  it("sorts categories by amount descending and computes share", () => {
    const expenses: Expense[] = [
      makeExpense({ date: "2026-08-02", amount: 420, category: "Food" }),
      makeExpense({ date: "2026-08-03", amount: 180, category: "Transportation" }),
      makeExpense({ date: "2026-08-04", amount: 95, category: "Entertainment" }),
    ];

    const result = computeMonthlyCategoryBreakdown(expenses, NOW);

    expect(result.total).toBe(695);
    expect(result.categories.map((c) => c.category)).toEqual([
      "Food",
      "Transportation",
      "Entertainment",
    ]);
    expect(result.categories[0].amount).toBe(420);
    expect(result.categories[0].share).toBeCloseTo(420 / 695);
  });

  it("returns an empty breakdown when there is no spending in the month", () => {
    const result = computeMonthlyCategoryBreakdown([], NOW);

    expect(result.total).toBe(0);
    expect(result.categories).toEqual([]);
    expect(result.monthLabel).toBe("August 2026");
  });
});

describe("computeBudgetStreak", () => {
  it("returns a zero streak when there are no expenses", () => {
    const result = computeBudgetStreak([], NOW);

    expect(result).toEqual({ streakDays: 0, windowDays: 30, dailyBudget: 0 });
  });

  it("counts consecutive recent days at or under the trailing average", () => {
    const spendDate = format(subDays(NOW, 5), "yyyy-MM-dd");
    const expenses: Expense[] = [
      makeExpense({ date: spendDate, amount: 300 }),
    ];

    const result = computeBudgetStreak(expenses, NOW, 30);

    // dailyBudget = 300 / 30 = 10; days 0-4 (today back to 4 days ago) have
    // $0 spend and are within budget, day 5 has $300 and breaks the streak.
    expect(result.dailyBudget).toBe(10);
    expect(result.streakDays).toBe(5);
  });

  it("breaks the streak immediately when today's spend exceeds the average", () => {
    const today = format(NOW, "yyyy-MM-dd");
    const expenses: Expense[] = [makeExpense({ date: today, amount: 50 })];

    const result = computeBudgetStreak(expenses, NOW, 30);

    expect(result.streakDays).toBe(0);
  });
});
