"use client";

import { useCloudExport } from "@/hooks/useCloudExport";
import { EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import { getDestination } from "@/lib/cloud/destinations";
import { DESTINATION_ICONS } from "./icons";

interface HistoryTabProps {
  cloud: ReturnType<typeof useCloudExport>;
}

export function HistoryTab({ cloud }: HistoryTabProps) {
  if (cloud.history.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400">
        No export activity yet. Everything you export, share, or sync will
        show up here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          {cloud.history.length} event{cloud.history.length === 1 ? "" : "s"}
        </h3>
        <button
          onClick={cloud.clearHistory}
          className="text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Clear history
        </button>
      </div>

      <div className="space-y-2">
        {cloud.history.map((entry) => {
          const template = EXPORT_TEMPLATES.find(
            (t) => t.id === entry.templateId
          )!;
          const destination = getDestination(entry.destinationId);
          const Icon = DESTINATION_ICONS[entry.destinationId];
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
            >
              <span
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: destination.color }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {template.name} &middot; {entry.detail}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(entry.timestamp).toLocaleString("en-US")} &middot;{" "}
                  {entry.recordCount} record
                  {entry.recordCount === 1 ? "" : "s"}
                </p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Success
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
