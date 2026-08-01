"use client";

import { CATEGORIES, Category } from "@/lib/types";

export interface Filters {
  search: string;
  category: Category | "All";
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export function ExpenseFilters({
  filters,
  onChange,
  onReset,
}: ExpenseFiltersProps) {
  const inputClasses =
    "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm";

  const hasActiveFilters =
    filters.search ||
    filters.category !== "All" ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
      <div className="lg:col-span-2">
        <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1">
          Search
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            id="search"
            type="text"
            placeholder="Search descriptions..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className={`${inputClasses} pl-9`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category-filter" className="block text-xs font-medium text-slate-500 mb-1">
          Category
        </label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value as Category | "All" })
          }
          className={inputClasses}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start-date" className="block text-xs font-medium text-slate-500 mb-1">
          From
        </label>
        <input
          id="start-date"
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="end-date" className="block text-xs font-medium text-slate-500 mb-1">
            To
          </label>
          <input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="mb-0.5 self-end rounded-lg px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Clear filters"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
