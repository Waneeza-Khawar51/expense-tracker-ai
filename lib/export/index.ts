import { Expense } from "@/lib/types";
import { ExportOptions, EXPORT_FORMAT_EXTENSIONS } from "./types";
import { filterExpensesForExport } from "./filter";
import { buildExportCSV } from "./csv";
import { buildExportJSON } from "./json";
import { buildExportPDF } from "./pdf";
import { triggerFileDownload } from "./download";

export * from "./types";
export { filterExpensesForExport } from "./filter";

const MIME_TYPES: Record<ExportOptions["format"], string> = {
  csv: "text/csv;charset=utf-8;",
  json: "application/json;charset=utf-8;",
  pdf: "application/pdf",
};

export function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-");
  return cleaned || "expenses";
}

export interface ExportRunResult {
  filename: string;
  recordCount: number;
}

export async function runExport(
  expenses: Expense[],
  options: ExportOptions
): Promise<ExportRunResult> {
  const filtered = filterExpensesForExport(expenses, options);
  const extension = EXPORT_FORMAT_EXTENSIONS[options.format];
  const filename = `${sanitizeFilename(options.filename)}.${extension}`;

  // Yield a tick so the caller's loading state can paint before the
  // (synchronous, and for PDF potentially slow) build work runs.
  await new Promise((resolve) => setTimeout(resolve, 0));

  let blob: Blob;
  switch (options.format) {
    case "csv":
      blob = new Blob([buildExportCSV(filtered)], { type: MIME_TYPES.csv });
      break;
    case "json":
      blob = new Blob([buildExportJSON(filtered)], { type: MIME_TYPES.json });
      break;
    case "pdf":
      blob = buildExportPDF(filtered);
      break;
  }

  triggerFileDownload(blob, filename);
  return { filename, recordCount: filtered.length };
}
