"use client";

import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { CategoryBadge } from "@/components/CategoryBadge";

interface ExportPreviewTableProps {
  expenses: Expense[];
  maxRows?: number;
}

export function ExportPreviewTable({
  expenses,
  maxRows = 8,
}: ExportPreviewTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
        No expenses match these filters.
      </div>
    );
  }

  const visible = expenses.slice(0, maxRows);
  const remaining = expenses.length - visible.length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Date
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Category
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Amount
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visible.map((e) => (
              <tr key={e.id}>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                  {formatDate(e.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <CategoryBadge category={e.category} />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-900">
                  {formatCurrency(e.amount)}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2 text-slate-600">
                  {e.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          + {remaining} more row{remaining === 1 ? "" : "s"} not shown in
          preview
        </div>
      )}
    </div>
  );
}
