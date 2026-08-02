"use client";

import { useState } from "react";
import { useCloudExport } from "@/hooks/useCloudExport";
import { EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import { DESTINATIONS, getDestination } from "@/lib/cloud/destinations";
import { DestinationId, Frequency, TemplateId } from "@/lib/cloud/types";
import { Button } from "@/components/ui/Button";
import { DESTINATION_ICONS } from "./icons";

const FREQUENCIES: { id: Frequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const selectClasses =
  "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-violet-600 text-sm";

function nextRunLabel(frequency: Frequency): string {
  const next = new Date();
  if (frequency === "daily") next.setDate(next.getDate() + 1);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  return next.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ScheduleTabProps {
  cloud: ReturnType<typeof useCloudExport>;
}

export function ScheduleTab({ cloud }: ScheduleTabProps) {
  const [templateId, setTemplateId] = useState<TemplateId>("monthly-summary");
  const [destinationId, setDestinationId] = useState<DestinationId>("email");
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          New scheduled export
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Template
            </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value as TemplateId)}
              className={selectClasses}
            >
              {EXPORT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Destination
            </label>
            <select
              value={destinationId}
              onChange={(e) =>
                setDestinationId(e.target.value as DestinationId)
              }
              className={selectClasses}
            >
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
              className={selectClasses}
            >
              {FREQUENCIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          className="mt-3"
          onClick={() => cloud.addSchedule(templateId, destinationId, frequency)}
        >
          Add schedule
        </Button>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          Active schedules
        </h3>
        {cloud.schedules.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
            No scheduled exports yet.
          </div>
        ) : (
          <div className="space-y-2">
            {cloud.schedules.map((schedule) => {
              const template = EXPORT_TEMPLATES.find(
                (t) => t.id === schedule.templateId
              )!;
              const destination = getDestination(schedule.destinationId);
              const Icon = DESTINATION_ICONS[schedule.destinationId];
              return (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-md text-white"
                      style={{ backgroundColor: destination.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {template.name} &rarr; {destination.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {FREQUENCIES.find((f) => f.id === schedule.frequency)
                          ?.label}{" "}
                        &middot; Next run {nextRunLabel(schedule.frequency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cloud.toggleSchedule(schedule.id)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        schedule.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {schedule.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => cloud.removeSchedule(schedule.id)}
                      aria-label="Delete schedule"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h12a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zM6 7a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1zm4 0a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Demo mode — schedules are saved locally but won&apos;t run
          automatically in this prototype.
        </p>
      </section>
    </div>
  );
}
