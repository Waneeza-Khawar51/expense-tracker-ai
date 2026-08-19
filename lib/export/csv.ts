import { Expense } from "@/lib/types";

function escapeCSVField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function buildExportCSV(expenses: Expense[]): string {
  const header = ["Date", "Category", "Amount", "Description"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    escapeCSVField(e.description),
  ]);
  return [header, ...rows].map((row) => row.join(",")).join("\n");
}
