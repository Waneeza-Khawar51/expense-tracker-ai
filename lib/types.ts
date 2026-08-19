export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
];

export interface Expense {
  id: string;
  date: string; // ISO date string (yyyy-MM-dd)
  amount: number;
  category: Category;
  description: string;
  createdAt: string; // ISO timestamp
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export const DEFAULT_CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f97316",
  Transportation: "#3b82f6",
  Entertainment: "#a855f7",
  Shopping: "#ec4899",
  Bills: "#ef4444",
  Other: "#64748b",
};

// Cycled through (by index) to assign a color to each newly created category.
export const CATEGORY_COLOR_PALETTE: string[] = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#64748b",
  "#14b8a6",
  "#eab308",
  "#8b5cf6",
  "#0ea5e9",
  "#f43f5e",
  "#10b981",
];

export const FALLBACK_CATEGORY_COLOR = "#64748b";
