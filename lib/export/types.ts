import { Category } from "@/lib/types";

export const EXPORT_FORMATS = ["csv", "json", "pdf"] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export interface ExportOptions {
  format: ExportFormat;
  startDate: string; // "" = unbounded
  endDate: string; // "" = unbounded
  categories: Category[]; // empty = every category
  filename: string; // without extension
}

export interface CategoryBreakdown {
  category: Category;
  count: number;
  total: number;
}

export interface ExportStats {
  count: number;
  total: number;
  average: number;
  earliestDate: string | null;
  latestDate: string | null;
  byCategory: CategoryBreakdown[];
}

export type ExportStatus = "idle" | "exporting" | "success" | "error";
