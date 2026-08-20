import { Card } from "@/components/ui/Card";

export interface KpiTrend {
  pct: number | null;
  /** Whether an upward move should read as good (green) or bad (red). */
  goodDirection: "up" | "down";
}

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: KpiTrend | null;
}

export function KpiCard({ label, value, hint, trend }: KpiCardProps) {
  const direction =
    trend && trend.pct !== null ? (trend.pct >= 0 ? "up" : "down") : null;
  const isGood = direction && trend ? direction === trend.goodDirection : null;

  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
        {trend && trend.pct !== null && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isGood ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3 w-3 ${direction === "down" ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 17a1 1 0 01-1-1V5.414L5.707 8.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 5.414V16a1 1 0 01-1 1z"
                clipRule="evenodd"
              />
            </svg>
            {Math.abs(trend.pct).toFixed(0)}%
          </span>
        )}
        {trend && trend.pct === null && (
          <span className="text-xs font-medium text-slate-400">new</span>
        )}
      </div>
    </Card>
  );
}
