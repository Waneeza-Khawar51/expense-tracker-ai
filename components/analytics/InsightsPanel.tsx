import type { ReactNode } from "react";
import { CategoryMover, PeriodComparison, RangeStats } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { CategoryBadge } from "@/components/CategoryBadge";

interface Insight {
  icon: ReactIconKind;
  text: ReactNode;
}

type ReactIconKind = "trend" | "category" | "spike" | "pace";

const ICONS: Record<ReactIconKind, JSX.Element> = {
  trend: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3.5 15a.75.75 0 01-.6-1.2l4-5.5a.75.75 0 011.14-.09l2.68 2.68 3.99-5.32a.75.75 0 111.2.9l-4.5 6a.75.75 0 01-1.14.09l-2.68-2.68-3.5 4.81a.75.75 0 01-.6.31z" />
    </svg>
  ),
  category: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-5a1 1 0 011 1v3.586l2.207 2.207a1 1 0 01-1.414 1.414l-2.5-2.5A1 1 0 019 10V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  spike: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  ),
  pace: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
};

interface InsightsPanelProps {
  stats: RangeStats;
  comparison: PeriodComparison | null;
  mover: CategoryMover | null;
}

export function InsightsPanel({ stats, comparison, mover }: InsightsPanelProps) {
  const insights: Insight[] = [];

  if (comparison && comparison.pctChange !== null) {
    const up = comparison.pctChange >= 0;
    insights.push({
      icon: "trend",
      text: (
        <>
          Spending in <span className="font-medium text-slate-800">{comparison.currentLabel}</span> is{" "}
          <span className={`font-medium ${up ? "text-red-500" : "text-emerald-600"}`}>
            {up ? "up" : "down"} {Math.abs(comparison.pctChange).toFixed(0)}%
          </span>{" "}
          from {comparison.previousLabel} ({formatCurrency(comparison.previousTotal)} →{" "}
          {formatCurrency(comparison.currentTotal)}).
        </>
      ),
    });
  }

  if (mover) {
    insights.push({
      icon: "category",
      text: mover.isNew ? (
        <>
          <CategoryBadge category={mover.category} /> is new spending this period, at{" "}
          <span className="font-medium text-slate-800">{formatCurrency(mover.currentAmount)}</span>.
        </>
      ) : (
        <>
          <CategoryBadge category={mover.category} /> grew the fastest, up{" "}
          <span className="font-medium text-red-500">
            {mover.pctChange !== null ? `${mover.pctChange.toFixed(0)}%` : ""}
          </span>{" "}
          ({formatCurrency(mover.previousAmount)} → {formatCurrency(mover.currentAmount)}).
        </>
      ),
    });
  }

  if (stats.biggestExpense) {
    insights.push({
      icon: "spike",
      text: (
        <>
          Biggest single expense was{" "}
          <span className="font-medium text-slate-800">
            {formatCurrency(stats.biggestExpense.amount)}
          </span>{" "}
          for &ldquo;{stats.biggestExpense.description}&rdquo; on{" "}
          {formatDate(stats.biggestExpense.date)}.
        </>
      ),
    });
  }

  if (stats.count > 0) {
    insights.push({
      icon: "pace",
      text: (
        <>
          Averaging{" "}
          <span className="font-medium text-slate-800">{formatCurrency(stats.avgPerDay)}/day</span>{" "}
          across {stats.count} transaction{stats.count === 1 ? "" : "s"} in this range.
        </>
      ),
    });
  }

  if (insights.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-700">Insights</h3>
        <p className="mt-3 text-sm text-slate-400">
          Add expenses in this range to see automated insights.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-700">Insights</h3>
      <ul className="mt-3 space-y-3">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              {ICONS[insight.icon]}
            </span>
            <span className="leading-relaxed">{insight.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
