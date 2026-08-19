import { TemplateResult } from "./types";

function escapeCSVField(field: string): string {
  if (/[",\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function buildCSV({ headers, rows }: TemplateResult): string {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCSVField).join(",")
  );
  return lines.join("\n");
}

export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
