import { Expense } from "@/lib/types";
import { ExportOptions } from "./types";
import { filterExpensesForExport } from "./filter";
import { computeExportStats } from "./stats";
import { buildFullFilename } from "./filename";
import { triggerBlobDownload } from "./download";
import { buildExportCSVBlob } from "./serializers/csv";
import { buildExportJSONBlob } from "./serializers/json";
import { buildExportPDFBlob } from "./serializers/pdf";

export * from "./types";
export { filterExpensesForExport } from "./filter";
export { computeExportStats } from "./stats";
export { defaultFilenameBase } from "./filename";

// PDF generation can take a perceptible moment on larger datasets, so this
// always resolves on a later tick — giving callers a real async boundary to
// drive a loading state off, rather than a purely synchronous "flash".
function buildBlob(expenses: Expense[], options: ExportOptions) {
  const stats = computeExportStats(expenses);
  switch (options.format) {
    case "csv":
      return buildExportCSVBlob(expenses);
    case "json":
      return buildExportJSONBlob(expenses, options, stats);
    case "pdf":
      return buildExportPDFBlob(expenses, options, stats);
  }
}

export async function runExport(
  allExpenses: Expense[],
  options: ExportOptions
): Promise<{ filename: string; recordCount: number }> {
  const scoped = filterExpensesForExport(allExpenses, options);

  await new Promise((resolve) => setTimeout(resolve, 0));

  const blob = buildBlob(scoped, options);
  const filename = buildFullFilename(options.filename, options.format);
  triggerBlobDownload(blob, filename);

  return { filename, recordCount: scoped.length };
}
