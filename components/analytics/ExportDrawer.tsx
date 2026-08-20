"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, Category, Expense } from "@/lib/types";
import {
  RANGE_PRESET_LABELS,
  RangePreset,
  buildExportFilename,
  filterExpensesByRange,
  resolveRangePreset,
} from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { downloadCSV } from "@/lib/csv";
import { Button } from "@/components/ui/Button";
import { CategoryBadge } from "@/components/CategoryBadge";

const PRESET_ORDER: RangePreset[] = [
  "last6months",
  "last12months",
  "thisYear",
  "lastYear",
  "allTime",
  "custom",
];

interface ExportDrawerProps {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
  initialPreset: RangePreset;
  initialCustomStart: string;
  initialCustomEnd: string;
}

export function ExportDrawer({
  open,
  onClose,
  expenses,
  initialPreset,
  initialCustomStart,
  initialCustomEnd,
}: ExportDrawerProps) {
  const [preset, setPreset] = useState<RangePreset>(initialPreset);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    new Set(CATEGORIES)
  );

  useEffect(() => {
    if (open) {
      setPreset(initialPreset);
      setCustomStart(initialCustomStart);
      setCustomEnd(initialCustomEnd);
      setSelectedCategories(new Set(CATEGORIES));
    }
  }, [open, initialPreset, initialCustomStart, initialCustomEnd]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const range = useMemo(
    () => resolveRangePreset(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  );

  const matched = useMemo(() => {
    return filterExpensesByRange(expenses, range).filter((e) =>
      selectedCategories.has(e.category)
    );
  }, [expenses, range, selectedCategories]);

  const matchedTotal = useMemo(
    () => matched.reduce((sum, e) => sum + e.amount, 0),
    [matched]
  );

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleExport() {
    downloadCSV(matched, buildExportFilename(range));
    onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Export Expenses</h2>
            <p className="text-xs text-slate-400">Choose a range and categories to include</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Date Range
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PRESET_ORDER.map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`rounded-lg px-3 py-2 text-left text-sm font-medium ring-1 ring-inset transition-colors ${
                    preset === p
                      ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
                      : "text-slate-600 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {RANGE_PRESET_LABELS[p]}
                </button>
              ))}
            </div>
            {preset === "custom" && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-slate-500">Start date</label>
                  <input
                    type="date"
                    value={customStart}
                    max={customEnd || undefined}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full rounded-lg border-0 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-slate-500">End date</label>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart || undefined}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full rounded-lg border-0 px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Categories
              </h3>
              <div className="flex gap-2 text-xs font-medium text-indigo-600">
                <button onClick={() => setSelectedCategories(new Set(CATEGORIES))}>
                  Select all
                </button>
                <span className="text-slate-300">|</span>
                <button onClick={() => setSelectedCategories(new Set())}>Clear</button>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <CategoryBadge category={cat} />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Preview
            </h3>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-sm text-slate-600">
                {matched.length} expense{matched.length === 1 ? "" : "s"} matched
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(matchedTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={matched.length === 0}>
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
