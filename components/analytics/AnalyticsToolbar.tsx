"use client";

import {
  Granularity,
  RANGE_PRESET_LABELS,
  RangePreset,
} from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

const PRESET_ORDER: RangePreset[] = [
  "last6months",
  "last12months",
  "thisYear",
  "lastYear",
  "allTime",
  "custom",
];

interface AnalyticsToolbarProps {
  preset: RangePreset;
  onPresetChange: (preset: RangePreset) => void;
  customStart: string;
  customEnd: string;
  onCustomRangeChange: (start: string, end: string) => void;
  granularity: Granularity;
  onGranularityChange: (granularity: Granularity) => void;
  yearlyDisabled: boolean;
  onOpenExport: () => void;
}

export function AnalyticsToolbar({
  preset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomRangeChange,
  granularity,
  onGranularityChange,
  yearlyDisabled,
  onOpenExport,
}: AnalyticsToolbarProps) {
  const segmentClasses = (active: boolean, disabled = false) =>
    `rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
      disabled
        ? "cursor-not-allowed text-slate-300"
        : active
          ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
          : "text-slate-500 hover:text-slate-700"
    }`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Range
        </span>
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {PRESET_ORDER.map((p) => (
            <button
              key={p}
              onClick={() => onPresetChange(p)}
              className={segmentClasses(preset === p)}
            >
              {RANGE_PRESET_LABELS[p]}
            </button>
          ))}
        </div>
        {preset === "custom" && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={customStart}
              max={customEnd || undefined}
              onChange={(e) => onCustomRangeChange(e.target.value, customEnd)}
              className="rounded-lg border-0 px-2 py-1.5 text-xs text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              onChange={(e) => onCustomRangeChange(customStart, e.target.value)}
              className="rounded-lg border-0 px-2 py-1.5 text-xs text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Bucket
        </span>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => onGranularityChange("monthly")}
            className={segmentClasses(granularity === "monthly")}
          >
            Monthly
          </button>
          <button
            onClick={() => !yearlyDisabled && onGranularityChange("yearly")}
            disabled={yearlyDisabled}
            title={
              yearlyDisabled
                ? "Select a range spanning more than a year to view yearly trends"
                : undefined
            }
            className={segmentClasses(granularity === "yearly", yearlyDisabled)}
          >
            Yearly
          </button>
        </div>

        <Button variant="secondary" size="sm" onClick={onOpenExport}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Export
        </Button>
      </div>
    </div>
  );
}
