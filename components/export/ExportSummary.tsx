import { ExportStats } from "@/lib/export";
import { formatCurrency, formatDate } from "@/lib/format";

interface ExportSummaryProps {
  stats: ExportStats;
  totalAvailable: number;
}

export function ExportSummary({ stats, totalAvailable }: ExportSummaryProps) {
  const dateRangeLabel =
    stats.earliestDate && stats.latestDate
      ? stats.earliestDate === stats.latestDate
        ? formatDate(stats.earliestDate)
        : `${formatDate(stats.earliestDate)} – ${formatDate(stats.latestDate)}`
      : "—";

  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-lg border border-slate-200 bg-slate-50">
      <div className="px-3 py-2.5 text-center">
        <p className="text-lg font-semibold text-slate-900">
          {stats.count}
          <span className="text-sm font-normal text-slate-400">
            /{totalAvailable}
          </span>
        </p>
        <p className="text-[11px] text-slate-500">Records</p>
      </div>
      <div className="px-3 py-2.5 text-center">
        <p className="text-lg font-semibold text-slate-900">
          {formatCurrency(stats.total)}
        </p>
        <p className="text-[11px] text-slate-500">Total amount</p>
      </div>
      <div className="px-3 py-2.5 text-center">
        <p className="truncate text-sm font-semibold text-slate-900">
          {dateRangeLabel}
        </p>
        <p className="text-[11px] text-slate-500">Date range</p>
      </div>
    </div>
  );
}
