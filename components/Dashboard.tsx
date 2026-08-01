"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Category, CATEGORY_COLORS, Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";

interface DashboardProps {
  expenses: Expense[];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function Dashboard({ expenses }: DashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const monthly = expenses
      .filter((e) => new Date(e.date) >= monthStart)
      .reduce((sum, e) => sum + e.amount, 0);

    const avgTransaction = expenses.length > 0 ? total / expenses.length : 0;

    const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(byCategory)
      .map(([category, value]) => ({
        category: category as Category,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    const topCategory = categoryData[0];

    const monthBuckets: { key: string; label: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthBuckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        total: 0,
      });
    }
    for (const e of expenses) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = monthBuckets.find((b) => b.key === key);
      if (bucket) bucket.total += e.amount;
    }

    return {
      total,
      monthly,
      avgTransaction,
      categoryData,
      topCategory,
      monthBuckets,
      count: expenses.length,
    };
  }, [expenses]);

  const summaryCards = [
    {
      label: "Total Spending",
      value: formatCurrency(stats.total),
      hint: `${stats.count} transaction${stats.count === 1 ? "" : "s"}`,
    },
    {
      label: "This Month",
      value: formatCurrency(stats.monthly),
      hint: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    },
    {
      label: "Avg. per Transaction",
      value: formatCurrency(stats.avgTransaction),
      hint: "across all expenses",
    },
    {
      label: "Top Category",
      value: stats.topCategory ? stats.topCategory.category : "—",
      hint: stats.topCategory
        ? formatCurrency(stats.topCategory.value)
        : "No data yet",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
          </Card>
        ))}
      </div>

      {expenses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-700">
              Spending by Category
            </h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {stats.categoryData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[entry.category]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-700">
              Last 6 Months
            </h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar
                    dataKey="total"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-slate-600">
            No spending data yet
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Add your first expense to see charts and analytics.
          </p>
        </Card>
      )}
    </div>
  );
}
