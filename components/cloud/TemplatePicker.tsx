"use client";

import { EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import { TemplateId } from "@/lib/cloud/types";

interface TemplatePickerProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {EXPORT_TEMPLATES.map((template) => {
        const active = value === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              active
                ? "border-violet-600 bg-violet-50 ring-1 ring-violet-600"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                active ? "text-violet-700" : "text-slate-800"
              }`}
            >
              {template.name}
            </span>
            <p className="mt-1 text-xs leading-snug text-slate-500">
              {template.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
