import { Expense } from "@/lib/types";

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function buildExportCSVBlob(expenses: Expense[]): Blob {
  const header = ["Date", "Category", "Description", "Amount"];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    escapeCSVField(e.description),
    e.amount.toFixed(2),
  ]);
  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}
