"use client";

import { useEffect, useState } from "react";
import { Expense } from "@/lib/types";
import { useCloudExport } from "@/hooks/useCloudExport";
import { ExportTab } from "./ExportTab";
import { ScheduleTab } from "./ScheduleTab";
import { ShareTab } from "./ShareTab";
import { HistoryTab } from "./HistoryTab";
import { IntegrationsTab } from "./IntegrationsTab";
import { CONNECTABLE_DESTINATIONS } from "@/lib/cloud/destinations";
import { StatusDot } from "./StatusDot";

type HubTab = "export" | "schedule" | "share" | "history" | "integrations";

const NAV_ITEMS: { id: HubTab; label: string }[] = [
  { id: "export", label: "Export" },
  { id: "schedule", label: "Schedule" },
  { id: "share", label: "Share" },
  { id: "history", label: "History" },
  { id: "integrations", label: "Integrations" },
];

interface CloudExportHubProps {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function CloudExportHub({ open, onClose, expenses }: CloudExportHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>("export");
  const cloud = useCloudExport();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const connectedCount = CONNECTABLE_DESTINATIONS.filter(
    (d) => cloud.connections[d.id]?.connected
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cloud Export Hub"
        className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Cloud Export Hub</h2>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">
                  Demo Mode
                </span>
              </div>
              <p className="mt-0.5 text-xs text-violet-100">
                Export, schedule, and share your expense data anywhere.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs sm:flex">
              <StatusDot active={connectedCount > 0} label="" />
              {connectedCount} of {CONNECTABLE_DESTINATIONS.length} services
              connected
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-44 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white/60"
                    }`}
                  >
                    {item.label}
                    {item.id === "history" && cloud.history.length > 0 && (
                      <span className="ml-1.5 text-xs text-slate-400">
                        ({cloud.history.length})
                      </span>
                    )}
                    {item.id === "schedule" && cloud.schedules.length > 0 && (
                      <span className="ml-1.5 text-xs text-slate-400">
                        ({cloud.schedules.length})
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "export" && (
              <ExportTab
                expenses={expenses}
                cloud={cloud}
                suggestSchedule={
                  cloud.history.length >= 3 &&
                  cloud.schedules.every((s) => !s.active)
                }
                onGoToSchedule={() => setActiveTab("schedule")}
              />
            )}
            {activeTab === "schedule" && <ScheduleTab cloud={cloud} />}
            {activeTab === "share" && <ShareTab cloud={cloud} />}
            {activeTab === "history" && <HistoryTab cloud={cloud} />}
            {activeTab === "integrations" && (
              <IntegrationsTab cloud={cloud} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
