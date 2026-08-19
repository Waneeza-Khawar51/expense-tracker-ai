"use client";

import { ExportFormat } from "@/lib/export";

interface FormatDescriptor {
  value: ExportFormat;
  label: string;
  hint: string;
  icon: ReactNodeSvg;
}

type ReactNodeSvg = JSX.Element;

const FORMATS: FormatDescriptor[] = [
  {
    value: "csv",
    label: "CSV",
    hint: "Spreadsheets",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4h2v2H6V7zm0 4h2v2H6v-2zm4-4h4v2h-4V7zm0 4h4v2h-4v-2z" />
      </svg>
    ),
  },
  {
    value: "json",
    label: "JSON",
    hint: "Dev / API use",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    value: "pdf",
    label: "PDF",
    hint: "Shareable report",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.914a2 2 0 00-.586-1.414l-3.914-3.914A2 2 0 0012.086 2H4zm0 2h7v3a2 2 0 002 2h3v9H4V4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {FORMATS.map((format) => {
        const active = value === format.value;
        return (
          <button
            key={format.value}
            type="button"
            onClick={() => onChange(format.value)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-center transition-colors ${
              active
                ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
            aria-pressed={active}
          >
            {format.icon}
            <span className="text-sm font-semibold">{format.label}</span>
            <span className="text-[11px] text-slate-400">{format.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
