"use client";

import { useEffect, useMemo, useState } from "react";
import { Expense, Category } from "@/lib/types";
import {
  ExportFormat,
  ExportStatus,
  defaultFilenameBase,
  filterExpensesForExport,
  computeExportStats,
  runExport,
} from "@/lib/export";
import { extensionFor } from "@/lib/export/filename";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { FormatSelector } from "./FormatSelector";
import { CategoryFilter } from "./CategoryFilter";
import { ExportSummary } from "./ExportSummary";
import { ExportPreviewTable } from "./ExportPreviewTable";

interface ExportDrawerProps {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
  initialStartDate?: string;
  initialEndDate?: string;
  initialCategory?: Category | "All";
}

export function ExportDrawer({
  open,
  onClose,
  expenses,
  initialStartDate = "",
  initialEndDate = "",
  initialCategory = "All",
}: ExportDrawerProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [categories, setCategories] = useState<Category[]>(
    initialCategory === "All" ? [] : [initialCategory]
  );
  const [filename, setFilename] = useState(defaultFilenameBase());
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [lastResult, setLastResult] = useState<{
    filename: string;
    recordCount: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setCategories(initialCategory === "All" ? [] : [initialCategory]);
    setFilename(defaultFilenameBase());
    setStatus("idle");
    setLastResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const scoped = useMemo(
    () => filterExpensesForExport(expenses, { startDate, endDate, categories }),
    [expenses, startDate, endDate, categories]
  );
  const stats = useMemo(() => computeExportStats(scoped), [scoped]);

  const canExport = stats.count > 0 && status !== "exporting";

  async function handleExport() {
    if (!canExport) return;
    setStatus("exporting");
    try {
      const result = await runExport(expenses, {
        format,
        startDate,
        endDate,
        categories,
        filename,
      });
      setLastResult(result);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Export Expenses"
      subtitle="Configure exactly what to include, preview it, then download."
      footer={
        <div className="space-y-2">
          {status === "success" && lastResult && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Downloaded {lastResult.filename} ({lastResult.recordCount} record
              {lastResult.recordCount === 1 ? "" : "s"})
            </p>
          )}
          {status === "error" && (
            <p className="text-xs font-medium text-red-600">
              Something went wrong generating the file. Please try again.
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              {stats.count} of {expenses.length} expense
              {expenses.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                size="sm"
                disabled={!canExport}
                onClick={handleExport}
              >
                {status === "exporting" ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Generating…
                  </>
                ) : (
                  `Export ${stats.count > 0 ? stats.count : ""} as ${format.toUpperCase()}`
                )}
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Format
          </h3>
          <FormatSelector value={format} onChange={setFormat} />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Date range
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="export-start" className="mb-1 block text-xs text-slate-500">
                From
              </label>
              <input
                id="export-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-lg border-0 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label htmlFor="export-end" className="mb-1 block text-xs text-slate-500">
                To
              </label>
              <input
                id="export-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-lg border-0 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Categories
          </h3>
          <CategoryFilter selected={categories} onChange={setCategories} />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filename
          </h3>
          <div className="flex items-center overflow-hidden rounded-lg ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={defaultFilenameBase()}
              className="w-full border-0 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-0"
            />
            <span className="whitespace-nowrap bg-slate-50 px-3 py-2 text-xs font-medium text-slate-400">
              .{extensionFor(format)}
            </span>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Summary
          </h3>
          <ExportSummary stats={stats} totalAvailable={expenses.length} />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Preview
          </h3>
          <ExportPreviewTable expenses={scoped} />
        </section>
      </div>
    </Drawer>
  );
}
