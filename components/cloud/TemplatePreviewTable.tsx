"use client";

import { TemplateResult } from "@/lib/cloud/types";

interface TemplatePreviewTableProps {
  result: TemplateResult;
  maxRows?: number;
}

export function TemplatePreviewTable({
  result,
  maxRows = 6,
}: TemplatePreviewTableProps) {
  if (result.rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
        No data available for this template.
      </div>
    );
  }

  const visible = result.rows.slice(0, maxRows);
  const remaining = result.rows.length - visible.length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {result.headers.map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visible.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="max-w-[180px] truncate whitespace-nowrap px-3 py-2 text-slate-600"
                  >
                    {cell}
                  </td>
                ))}
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
