export const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  date: string; // ISO date string (yyyy-MM-dd)
  amount: number;
  category: Category;
  description: string;
  createdAt: string; // ISO timestamp
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f97316",
  Transportation: "#3b82f6",
  Entertainment: "#a855f7",
  Shopping: "#ec4899",
  Bills: "#ef4444",
  Other: "#64748b",
};
