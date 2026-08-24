"use client";

import { CATEGORY_COLORS } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { TopCategoryDatum } from "@/components/analytics/TopCategoriesChart";

interface TopCategoriesListProps {
  data: TopCategoryDatum[];
  total: number;
}

export function TopCategoriesList({ data, total }: TopCategoriesListProps) {
  return (
    <ol className="space-y-4">
      {data.map((entry, index) => {
        const share = total > 0 ? (entry.total / total) * 100 : 0;
        const color = CATEGORY_COLORS[entry.category];
        return (
          <li key={entry.category}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  {index + 1}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {entry.category}
                </span>
                <span className="text-xs text-slate-400">
                  {entry.count} expense{entry.count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="text-right text-sm">
                <span className="font-semibold text-slate-900">
                  {formatCurrency(entry.total)}
                </span>{" "}
                <span className="text-slate-400">({share.toFixed(0)}%)</span>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${share}%`, backgroundColor: color }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
