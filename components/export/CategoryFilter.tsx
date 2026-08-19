"use client";

import { CATEGORIES, Category } from "@/lib/types";

interface CategoryFilterProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const allSelected = selected.length === CATEGORIES.length;

  function toggle(category: Category) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {selected.length} of {CATEGORIES.length} categories
        </span>
        <button
          type="button"
          onClick={() => onChange(allSelected ? [] : [...CATEGORIES])}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const active = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${
                active
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
