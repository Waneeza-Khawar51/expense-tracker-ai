import { ExportFormat } from "./types";

const EXTENSIONS: Record<ExportFormat, string> = {
  csv: "csv",
  json: "json",
  pdf: "pdf",
};

export function extensionFor(format: ExportFormat): string {
  return EXTENSIONS[format];
}

export function sanitizeFilenameBase(raw: string): string {
  const trimmed = raw.trim().replace(/\.[a-z0-9]+$/i, "");
  const cleaned = trimmed.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-{2,}/g, "-");
  return cleaned.replace(/^-+|-+$/g, "");
}

export function defaultFilenameBase(): string {
  return `expenses-export-${new Date().toISOString().slice(0, 10)}`;
}

export function buildFullFilename(base: string, format: ExportFormat): string {
  const clean = sanitizeFilenameBase(base) || defaultFilenameBase();
  return `${clean}.${extensionFor(format)}`;
}
