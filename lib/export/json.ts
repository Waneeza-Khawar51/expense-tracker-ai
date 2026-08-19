import { Expense } from "@/lib/types";

export function buildExportJSON(expenses: Expense[]): string {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const payload = {
    exportedAt: new Date().toISOString(),
    recordCount: expenses.length,
    totalAmount: Math.round(totalAmount * 100) / 100,
    expenses: expenses.map((e) => ({
      date: e.date,
      category: e.category,
      amount: e.amount,
      description: e.description,
    })),
  };
  return JSON.stringify(payload, null, 2);
}
