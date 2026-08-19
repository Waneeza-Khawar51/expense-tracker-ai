import { TemplateResult } from "./types";

export function buildJSON(result: TemplateResult): string {
  const records = result.rows.map((row) =>
    Object.fromEntries(result.headers.map((header, i) => [header, row[i]]))
  );
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      headers: result.headers,
      records,
    },
    null,
    2
  );
}
