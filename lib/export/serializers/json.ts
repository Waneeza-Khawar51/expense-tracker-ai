import { Expense } from "@/lib/types";
import { ExportOptions, ExportStats } from "../types";

interface ExportJSONPayload {
  meta: {
    exportedAt: string;
    recordCount: number;
    totalAmount: number;
    filters: {
      startDate: string | null;
      endDate: string | null;
      categories: string[] | "all";
    };
  };
  expenses: Expense[];
}

export function buildExportJSONBlob(
  expenses: Expense[],
  options: Pick<ExportOptions, "startDate" | "endDate" | "categories">,
  stats: ExportStats
): Blob {
  const payload: ExportJSONPayload = {
    meta: {
      exportedAt: new Date().toISOString(),
      recordCount: stats.count,
      totalAmount: Number(stats.total.toFixed(2)),
      filters: {
        startDate: options.startDate || null,
        endDate: options.endDate || null,
        categories: options.categories.length > 0 ? options.categories : "all",
      },
    },
    expenses,
  };
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
}
