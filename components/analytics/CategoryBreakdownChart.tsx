"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Category, CATEGORY_COLORS } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface CategoryBreakdownChartProps {
  categoryData: { category: Category; value: number }[];
  total: number;
}

export function CategoryBreakdownChart({
  categoryData,
  total,
}: CategoryBreakdownChartProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {categoryData.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="space-y-2.5">
        {categoryData.map((entry) => {
          const share = total > 0 ? (entry.value / total) * 100 : 0;
          return (
            <li key={entry.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
                  />
                  {entry.category}
                </span>
                <span className="text-slate-500">
                  {formatCurrency(entry.value)}{" "}
                  <span className="text-slate-400">({share.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${share}%`,
                    backgroundColor: CATEGORY_COLORS[entry.category],
                  }}
                />
              </div>
            </li>
          );
        })}
        {categoryData.length === 0 && (
          <li className="text-sm text-slate-400">No spending in this range</li>
        )}
      </ul>
    </div>
  );
}
