"use client";

import {
  EXPORT_FORMAT_DESCRIPTIONS,
  EXPORT_FORMAT_LABELS,
  ExportFormat,
} from "@/lib/export";

const FORMATS: ExportFormat[] = ["csv", "json", "pdf"];

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Export format"
      className="grid grid-cols-3 gap-3"
    >
      {FORMATS.map((format) => {
        const active = value === format;
        return (
          <button
            key={format}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(format)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              active
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                active ? "text-indigo-700" : "text-slate-800"
              }`}
            >
              {EXPORT_FORMAT_LABELS[format]}
            </span>
            <p className="mt-1 text-xs leading-snug text-slate-500">
              {EXPORT_FORMAT_DESCRIPTIONS[format]}
            </p>
          </button>
        );
      })}
    </div>
  );
}
