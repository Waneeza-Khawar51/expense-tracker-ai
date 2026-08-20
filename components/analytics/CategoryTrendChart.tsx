"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORY_COLORS } from "@/lib/types";
import {
  CATEGORY_STACK_ORDER,
  LINE_DASH_PATTERNS,
  TrendBucket,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

interface CategoryTrendChartProps {
  buckets: TrendBucket[];
}

type ChartMode = "stacked" | "lines";

export function CategoryTrendChart({ buckets }: CategoryTrendChartProps) {
  const [mode, setMode] = useState<ChartMode>("stacked");

  const data = useMemo(
    () =>
      buckets.map((b) => ({
        label: b.label,
        ...b.byCategory,
      })),
    [buckets]
  );

  const activeCategories = useMemo(
    () =>
      CATEGORY_STACK_ORDER.filter((cat) =>
        buckets.some((b) => b.byCategory[cat] > 0)
      ),
    [buckets]
  );

  const segmentClasses = (active: boolean) =>
    `rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
      active
        ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
        : "text-slate-500 hover:text-slate-700"
    }`;

  return (
    <div>
      <div className="flex items-center justify-end">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setMode("stacked")}
            className={segmentClasses(mode === "stacked")}
          >
            Stacked
          </button>
          <button
            onClick={() => setMode("lines")}
            className={segmentClasses(mode === "lines")}
          >
            Lines
          </button>
        </div>
      </div>

      <div className="mt-3 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "stacked" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
                width={56}
              />
              <Tooltip
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
                contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 13 }}
              />
              {CATEGORY_STACK_ORDER.map((cat) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  name={cat}
                  stackId="categories"
                  fill={CATEGORY_COLORS[cat]}
                  radius={[0, 0, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
                width={56}
              />
              <Tooltip
                formatter={(value, name) => [formatCurrency(Number(value)), name]}
                contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0", fontSize: 13 }}
              />
              {CATEGORY_STACK_ORDER.map((cat) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  name={cat}
                  stroke={CATEGORY_COLORS[cat]}
                  strokeWidth={2}
                  strokeDasharray={LINE_DASH_PATTERNS[cat]}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
        {activeCategories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            {cat}
          </span>
        ))}
        {activeCategories.length === 0 && (
          <span className="text-xs text-slate-400">No category data in this range</span>
        )}
      </div>
    </div>
  );
}
