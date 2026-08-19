"use client";

import { useEffect, useMemo, useState } from "react";
import { Expense } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { useCloudExport } from "@/hooks/useCloudExport";
import { buildTemplateResult, EXPORT_TEMPLATES } from "@/lib/cloud/templates";
import { getDestination } from "@/lib/cloud/destinations";
import { buildCSV, triggerFileDownload } from "@/lib/cloud/csv";
import { buildJSON } from "@/lib/cloud/json";
import { DestinationId, TemplateId } from "@/lib/cloud/types";
import { Button } from "@/components/ui/Button";
import { TemplatePicker } from "./TemplatePicker";
import { TemplatePreviewTable } from "./TemplatePreviewTable";
import { DestinationPicker } from "./DestinationPicker";
import { DESTINATION_ICONS } from "./icons";

const inputClasses =
  "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 text-sm";
const labelClasses = "block text-xs font-medium text-slate-500 mb-1";

interface ExportTabProps {
  expenses: Expense[];
  cloud: ReturnType<typeof useCloudExport>;
  suggestSchedule: boolean;
  onGoToSchedule: () => void;
}

export function ExportTab({
  expenses,
  cloud,
  suggestSchedule,
  onGoToSchedule,
}: ExportTabProps) {
  const [templateId, setTemplateId] = useState<TemplateId>("detailed");
  const [destinationId, setDestinationId] = useState<DestinationId>("download");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [filename, setFilename] = useState(`expenses-${todayISO()}`);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const template = EXPORT_TEMPLATES.find((t) => t.id === templateId)!;
  const destination = getDestination(destinationId);
  const templateResult = useMemo(
    () => buildTemplateResult(templateId, expenses),
    [templateId, expenses]
  );
  const recordCount = templateResult.rows.length;

  useEffect(() => {
    setEmailSubject(`Your ${template.name} export`);
    setFeedback(null);
  }, [template.name]);

  useEffect(() => {
    setFeedback(null);
  }, [destinationId]);

  const connection = destination.connectable
    ? cloud.connections[destinationId]
    : undefined;

  async function handleDownload() {
    setIsProcessing(true);
    try {
      const content =
        format === "csv" ? buildCSV(templateResult) : buildJSON(templateResult);
      const blob = new Blob([content], {
        type:
          format === "csv"
            ? "text/csv;charset=utf-8;"
            : "application/json;charset=utf-8;",
      });
      const cleanName = filename.trim() || "expenses";
      triggerFileDownload(blob, `${cleanName}.${format}`);
      cloud.logHistory({
        templateId,
        destinationId: "download",
        recordCount,
        detail: `Downloaded ${cleanName}.${format}`,
      });
      setFeedback(`Downloaded ${cleanName}.${format}`);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleEmailSend() {
    if (!emailTo.trim()) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      cloud.logHistory({
        templateId,
        destinationId: "email",
        recordCount,
        detail: `Emailed to ${emailTo.trim()}`,
      });
      setFeedback(`Sent to ${emailTo.trim()}`);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleConnect() {
    setIsConnecting(true);
    try {
      await cloud.connect(destinationId);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleCloudSync() {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1300));
      cloud.markSynced(destinationId);
      cloud.logHistory({
        templateId,
        destinationId,
        recordCount,
        detail: `Synced to ${destination.name}`,
      });
      setFeedback(`Synced to ${destination.name}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const Icon = DESTINATION_ICONS[destinationId];

  return (
    <div className="space-y-6">
      {suggestSchedule && (
        <div className="flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm text-violet-800">
          <span className="text-base leading-none">💡</span>
          <div className="flex-1">
            You&apos;ve exported a few times now — set up a recurring
            schedule so it happens automatically.
          </div>
          <button
            onClick={onGoToSchedule}
            className="whitespace-nowrap font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
          >
            Set up
          </button>
        </div>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Template</h3>
        <TemplatePicker value={templateId} onChange={setTemplateId} />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Preview</h3>
          <span className="text-xs text-slate-500">
            {recordCount} row{recordCount === 1 ? "" : "s"}
          </span>
        </div>
        <TemplatePreviewTable result={templateResult} />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          Send to
        </h3>
        <DestinationPicker
          value={destinationId}
          onChange={setDestinationId}
          connections={cloud.connections}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white"
            style={{ backgroundColor: destination.color }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {destination.name}
            </p>
            <p className="text-xs text-slate-500">{destination.description}</p>
          </div>
        </div>

        {destinationId === "download" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {(["csv", "json"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    format === f
                      ? "bg-slate-900 text-white ring-slate-900"
                      : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="cloud-filename" className={labelClasses}>
                Filename
              </label>
              <div className="flex items-stretch">
                <input
                  id="cloud-filename"
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className={`${inputClasses} rounded-r-none`}
                />
                <span className="inline-flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-white px-3 text-sm text-slate-500">
                  .{format}
                </span>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              disabled={isProcessing || recordCount === 0}
            >
              {isProcessing ? "Preparing…" : `Download ${recordCount} rows`}
            </Button>
          </div>
        )}

        {destinationId === "email" && (
          <div className="space-y-3">
            <div>
              <label htmlFor="cloud-email-to" className={labelClasses}>
                To
              </label>
              <input
                id="cloud-email-to"
                type="email"
                placeholder="you@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="cloud-email-subject" className={labelClasses}>
                Subject
              </label>
              <input
                id="cloud-email-subject"
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className={inputClasses}
              />
            </div>
            <Button
              onClick={handleEmailSend}
              disabled={isProcessing || !emailTo.trim() || recordCount === 0}
            >
              {isProcessing ? "Sending…" : `Send ${recordCount} rows`}
            </Button>
            <p className="text-xs text-slate-400">
              Demo mode — this simulates sending and doesn&apos;t deliver a
              real email.
            </p>
          </div>
        )}

        {destination.connectable && (
          <div className="space-y-3">
            {connection?.connected ? (
              <>
                <p className="text-xs text-slate-500">
                  Last synced{" "}
                  {connection.lastSyncedAt
                    ? new Date(connection.lastSyncedAt).toLocaleString("en-US")
                    : "never"}
                </p>
                <Button
                  onClick={handleCloudSync}
                  disabled={isProcessing || recordCount === 0}
                >
                  {isProcessing
                    ? "Syncing…"
                    : `Export ${recordCount} rows to ${destination.name}`}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  Not connected yet — connect your account to export directly.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting…" : `Connect ${destination.name}`}
                </Button>
              </>
            )}
            <p className="text-xs text-slate-400">
              Demo mode — this simulates the {destination.name} integration.
            </p>
          </div>
        )}

        {feedback && (
          <p className="mt-3 text-sm font-medium text-emerald-600">
            ✓ {feedback}
          </p>
        )}
      </section>
    </div>
  );
}
