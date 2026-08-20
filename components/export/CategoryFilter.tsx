"use client";

import { CATEGORIES, Category, CATEGORY_COLORS } from "@/lib/types";

interface CategoryFilterProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const allSelected = selected.length === 0;

  function toggle(category: Category) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange([])}
        className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
          allSelected
            ? "bg-indigo-600 text-white ring-indigo-600"
            : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
        }`}
      >
        All categories
      </button>
      {CATEGORIES.map((category) => {
        const active = selected.includes(category);
        const color = CATEGORY_COLORS[category];
        return (
          <button
            key={category}
            type="button"
            onClick={() => toggle(category)}
            aria-pressed={active}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors"
            style={
              active
                ? { backgroundColor: `${color}1a`, color, boxShadow: `inset 0 0 0 1px ${color}` }
                : { color: "#64748b", boxShadow: "inset 0 0 0 1px #cbd5e1" }
            }
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            {category}
          </button>
        );
      })}
    </div>
  );
}
