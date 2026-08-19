"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, Category, Expense } from "@/lib/types";
import { formatCurrency, todayISO } from "@/lib/format";
import {
  EXPORT_FORMAT_EXTENSIONS,
  ExportFormat,
  filterExpensesForExport,
  runExport,
  sanitizeFilename,
} from "@/lib/export";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { FormatSelector } from "@/components/export/FormatSelector";
import { CategoryFilter } from "@/components/export/CategoryFilter";
import { ExportPreviewTable } from "@/components/export/ExportPreviewTable";

interface ExportPanelProps {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
}

const inputClasses =
  "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm";
const labelClasses = "block text-xs font-medium text-slate-500 mb-1";

export function ExportPanel({ open, onClose, expenses }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);
  const [filename, setFilename] = useState(`expenses-${todayISO()}`);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<{
    filename: string;
    recordCount: number;
  } | null>(null);

  const filtered = useMemo(
    () =>
      filterExpensesForExport(expenses, { startDate, endDate, categories }),
    [expenses, startDate, endDate, categories]
  );

  const totalAmount = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  const extension = EXPORT_FORMAT_EXTENSIONS[format];
  const cleanFilename = sanitizeFilename(filename);
  const canExport = filtered.length > 0 && !isExporting;

  function handleClose() {
    if (isExporting) return;
    setResult(null);
    onClose();
  }

  function resetFilters() {
    setStartDate("");
    setEndDate("");
    setCategories([...CATEGORIES]);
  }

  async function handleExport() {
    setIsExporting(true);
    setResult(null);
    try {
      const outcome = await runExport(expenses, {
        format,
        startDate,
        endDate,
        categories,
        filename,
      });
      setResult(outcome);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Export Data"
      description="Choose a format, filter what you need, and download."
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="min-h-[1.25rem] text-sm">
            {result ? (
              <span className="font-medium text-emerald-600">
                Exported {result.recordCount} record
                {result.recordCount === 1 ? "" : "s"} to {result.filename}
              </span>
            ) : (
              <span className="text-slate-500">
                {filtered.length} record{filtered.length === 1 ? "" : "s"}{" "}
                selected &middot; {formatCurrency(totalAmount)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={isExporting}>
              Close
            </Button>
            <Button onClick={handleExport} disabled={!canExport}>
              {isExporting ? (
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
                  Exporting...
                </>
              ) : (
                `Export ${filtered.length} record${
                  filtered.length === 1 ? "" : "s"
                }`
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Format
          </h3>
          <FormatSelector value={format} onChange={setFormat} />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Reset filters
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="export-start-date" className={labelClasses}>
                From
              </label>
              <input
                id="export-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="export-end-date" className={labelClasses}>
                To
              </label>
              <input
                id="export-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
          <div className="mt-3">
            <CategoryFilter selected={categories} onChange={setCategories} />
          </div>
        </section>

        <section>
          <label htmlFor="export-filename" className={labelClasses}>
            Filename
          </label>
          <div className="flex items-stretch">
            <input
              id="export-filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="expenses"
              className={`${inputClasses} rounded-r-none`}
            />
            <span className="inline-flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
              .{extension}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Will download as {cleanFilename}.{extension}
          </p>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Preview</h3>
            <span className="text-xs text-slate-500">
              {filtered.length} of {expenses.length} expenses &middot;{" "}
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <ExportPreviewTable expenses={filtered} />
        </section>
      </div>
    </Drawer>
  );
}
