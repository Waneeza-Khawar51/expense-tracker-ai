import { Expense } from "@/lib/types";
import { ExportOptions } from "./types";

export function filterExpensesForExport(
  expenses: Expense[],
  options: Pick<ExportOptions, "startDate" | "endDate" | "categories">
): Expense[] {
  return expenses
    .filter((e) => {
      if (options.startDate && e.date < options.startDate) return false;
      if (options.endDate && e.date > options.endDate) return false;
      if (!options.categories.includes(e.category)) return false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
