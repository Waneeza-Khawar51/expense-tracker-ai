import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { CategoryBadge } from "@/components/CategoryBadge";

const PREVIEW_ROW_LIMIT = 6;

interface ExportPreviewTableProps {
  expenses: Expense[];
}

export function ExportPreviewTable({ expenses }: ExportPreviewTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
        <p className="text-sm font-medium text-slate-600">No records match these filters</p>
        <p className="mt-1 text-xs text-slate-400">
          Widen the date range or category selection above.
        </p>
      </div>
    );
  }

  const visible = expenses.slice(0, PREVIEW_ROW_LIMIT);
  const remaining = expenses.length - visible.length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Category</th>
            <th className="px-3 py-2 font-medium">Description</th>
            <th className="px-3 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visible.map((e) => (
            <tr key={e.id}>
              <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                {formatDate(e.date)}
              </td>
              <td className="px-3 py-2">
                <CategoryBadge category={e.category} />
              </td>
              <td className="max-w-[10rem] truncate px-3 py-2 text-slate-700">
                {e.description}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-slate-900">
                {formatCurrency(e.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {remaining > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
          + {remaining} more record{remaining === 1 ? "" : "s"} in the full export
        </div>
      )}
    </div>
  );
}
