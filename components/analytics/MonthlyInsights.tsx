"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Category, CATEGORY_COLORS, Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import {
  computeBudgetStreak,
  computeMonthlyCategoryBreakdown,
} from "@/lib/monthlyInsights";
import { Card } from "@/components/ui/Card";

const CATEGORY_EMOJI: Record<Category, string> = {
  Food: "🍔",
  Transportation: "🚗",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Bills: "🧾",
  Other: "💰",
};

const TOP_CATEGORY_COUNT = 3;

interface MonthlyInsightsProps {
  expenses: Expense[];
  now?: Date;
}

export function MonthlyInsights({ expenses, now = new Date() }: MonthlyInsightsProps) {
  const breakdown = computeMonthlyCategoryBreakdown(expenses, now);
  const streak = computeBudgetStreak(expenses, now);
  const topCategories = breakdown.categories.slice(0, TOP_CATEGORY_COUNT);
  const streakProgress =
    streak.windowDays > 0
      ? Math.min(1, streak.streakDays / streak.windowDays)
      : 0;

  return (
    <Card className="mx-auto max-w-md p-6">
      <div className="border-b-2 border-dashed border-slate-300 pb-3 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Monthly Insights</h2>
        <p className="mt-0.5 text-sm text-slate-400">{breakdown.monthLabel}</p>
      </div>

      {breakdown.categories.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-400">
          No spending recorded this month yet.
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-6 h-56 w-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown.categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="#0f172a"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {breakdown.categories.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm">
                Spending
              </span>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {topCategories.map((entry) => (
              <li key={entry.category} className="flex items-center gap-3">
                <span
                  className="h-8 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
                />
                <span className="text-base text-slate-800">
                  {CATEGORY_EMOJI[entry.category]} {entry.category}:{" "}
                  <span className="font-semibold">
                    {formatCurrency(entry.amount)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 rounded-xl border-2 border-dashed border-slate-300 p-5 text-center">
        <p className="text-sm font-medium text-slate-500">Budget Streak</p>
        <p className="mt-1 text-4xl font-bold text-emerald-500">
          {streak.streakDays}
        </p>
        <p className="text-sm text-slate-500">days!</p>
        <div className="mx-auto mt-4 h-3 w-40 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${streakProgress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Days at or under your {formatCurrency(streak.dailyBudget)}/day average
        </p>
      </div>
    </Card>
  );
}
