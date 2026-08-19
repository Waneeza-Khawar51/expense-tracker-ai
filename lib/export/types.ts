import { Category } from "@/lib/types";

export type ExportFormat = "csv" | "json" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  startDate: string; // "" = unbounded
  endDate: string; // "" = unbounded
  categories: Category[];
  filename: string; // without extension
}

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: "CSV",
  json: "JSON",
  pdf: "PDF",
};

export const EXPORT_FORMAT_DESCRIPTIONS: Record<ExportFormat, string> = {
  csv: "Spreadsheet-friendly, opens in Excel or Sheets",
  json: "Structured data for scripts and integrations",
  pdf: "Formatted report, ready to print or share",
};

export const EXPORT_FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  csv: "csv",
  json: "json",
  pdf: "pdf",
};
