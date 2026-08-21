"use client";

import { useEffect, useMemo, useState } from "react";
import { Category, Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import {
  Granularity,
  RangePreset,
  buildTrendBuckets,
  computeFastestMovingCategory,
  computePeriodComparison,
  computeRangeStats,
  dateRangeToISO,
  filterExpensesByRange,
  resolveRangePreset,
  spansMultipleYears,
} from "@/lib/analytics";
import { AnalyticsToolbar } from "@/components/analytics/AnalyticsToolbar";
import { KpiCard } from "@/components/analytics/KpiCard";
import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { SpendingTrendChart } from "@/components/analytics/SpendingTrendChart";
import { CategoryTrendChart } from "@/components/analytics/CategoryTrendChart";
import { InsightsPanel } from "@/components/analytics/InsightsPanel";
import { ExportDrawer } from "@/components/export/ExportDrawer";

interface DashboardProps {
  expenses: Expense[];
}

export function Dashboard({ expenses }: DashboardProps) {
  const [preset, setPreset] = useState<RangePreset>("last6months");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const range = useMemo(
    () => resolveRangePreset(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  );

  const isoRange = useMemo(() => dateRangeToISO(range), [range]);

  const yearlyDisabled = useMemo(
    () => !spansMultipleYears(expenses, range),
    [expenses, range]
  );

  useEffect(() => {
    if (yearlyDisabled && granularity === "yearly") {
      setGranularity("monthly");
    }
  }, [yearlyDisabled, granularity]);

  const rangeExpenses = useMemo(
    () => filterExpensesByRange(expenses, range),
    [expenses, range]
  );

  const buckets = useMemo(
    () => buildTrendBuckets(expenses, granularity, range),
    [expenses, granularity, range]
  );

  const stats = useMemo(() => computeRangeStats(rangeExpenses, range), [rangeExpenses, range]);
  const comparison = useMemo(() => computePeriodComparison(buckets), [buckets]);
  const mover = useMemo(() => computeFastestMovingCategory(buckets), [buckets]);

  const categoryData = useMemo(() => {
    const byCategory = rangeExpenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
    return Object.entries(byCategory)
      .map(([category, value]) => ({ category: category as Category, value }))
      .sort((a, b) => b.value - a.value);
  }, [rangeExpenses]);

  if (expenses.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-slate-600">No spending data yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Add your first expense to see charts and analytics.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsToolbar
        preset={preset}
        onPresetChange={setPreset}
        customStart={customStart}
        customEnd={customEnd}
        onCustomRangeChange={(start, end) => {
          setCustomStart(start);
          setCustomEnd(end);
        }}
        granularity={granularity}
        onGranularityChange={setGranularity}
        yearlyDisabled={yearlyDisabled}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Spending"
          value={formatCurrency(stats.total)}
          hint={`${stats.count} transaction${stats.count === 1 ? "" : "s"}`}
          trend={
            comparison
              ? { pct: comparison.pctChange, goodDirection: "down" }
              : null
          }
        />
        <KpiCard
          label="Daily Average"
          value={formatCurrency(stats.avgPerDay)}
          hint="across selected range"
        />
        <KpiCard
          label="Avg. per Transaction"
          value={formatCurrency(stats.avgTransaction)}
          hint="across selected range"
        />
        <KpiCard
          label="Top Category"
          value={stats.topCategory ? stats.topCategory.category : "—"}
          hint={
            stats.topCategory
              ? `${formatCurrency(stats.topCategory.amount)} · ${(stats.topCategory.share * 100).toFixed(0)}% of spend`
              : "No data in range"
          }
        />
      </div>

      {rangeExpenses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Spending by Category
              </h3>
              <div className="mt-4">
                <CategoryBreakdownChart categoryData={categoryData} total={stats.total} />
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-700">Spending Trend</h3>
              <div className="mt-4">
                <SpendingTrendChart buckets={buckets} />
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-700">
              Category Trends by {granularity === "monthly" ? "Month" : "Year"}
            </h3>
            <CategoryTrendChart buckets={buckets} />
          </Card>

          <InsightsPanel stats={stats} comparison={comparison} mover={mover} />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-slate-600">
            No spending in this range
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Try a wider date range to see charts and insights.
          </p>
        </Card>
      )}

      <ExportDrawer
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        expenses={expenses}
        initialStartDate={isoRange.start}
        initialEndDate={isoRange.end}
        initialCategory="All"
      />
    </div>
  );
}
