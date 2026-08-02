import { Expense } from "@/lib/types";
import { ExportTemplateMeta, TemplateId, TemplateResult } from "./types";

export const EXPORT_TEMPLATES: ExportTemplateMeta[] = [
  {
    id: "detailed",
    name: "Detailed Export",
    description: "Every transaction, one row per expense.",
  },
  {
    id: "tax-report",
    name: "Tax Report",
    description: "Year-to-date transactions with a totals row for filing.",
  },
  {
    id: "monthly-summary",
    name: "Monthly Summary",
    description: "Spending grouped by month and category.",
  },
  {
    id: "category-analysis",
    name: "Category Analysis",
    description: "Totals and share of spend per category.",
  },
];

function monthLabel(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function buildDetailed(expenses: Expense[]): TemplateResult {
  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  return {
    headers: ["Date", "Category", "Amount", "Description"],
    rows: sorted.map((e) => [
      e.date,
      e.category,
      e.amount.toFixed(2),
      e.description,
    ]),
  };
}

function buildTaxReport(expenses: Expense[]): TemplateResult {
  const year = new Date().getFullYear();
  const yearExpenses = expenses
    .filter((e) => e.date.startsWith(String(year)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = yearExpenses.reduce((sum, e) => sum + e.amount, 0);

  const rows = yearExpenses.map((e) => [
    e.date,
    e.category,
    e.amount.toFixed(2),
    e.description,
  ]);
  rows.push(["", "", total.toFixed(2), `TOTAL — ${year}`]);

  return { headers: ["Date", "Category", "Amount", "Description"], rows };
}

function buildMonthlySummary(expenses: Expense[]): TemplateResult {
  const totals = new Map<string, number>();
  for (const e of expenses) {
    const key = `${e.date.slice(0, 7)}|${e.category}`;
    totals.set(key, (totals.get(key) ?? 0) + e.amount);
  }

  const rows = Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, total]) => {
      const [month, category] = key.split("|");
      return [monthLabel(`${month}-01`), category, total.toFixed(2)];
    });

  return { headers: ["Month", "Category", "Total"], rows };
}

function buildCategoryAnalysis(expenses: Expense[]): TemplateResult {
  const totals = new Map<string, { count: number; total: number }>();
  const overall = expenses.reduce((sum, e) => sum + e.amount, 0);

  for (const e of expenses) {
    const entry = totals.get(e.category) ?? { count: 0, total: 0 };
    entry.count += 1;
    entry.total += e.amount;
    totals.set(e.category, entry);
  }

  const rows = Array.from(totals.entries())
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([category, { count, total }]) => [
      category,
      String(count),
      total.toFixed(2),
      overall > 0 ? `${((total / overall) * 100).toFixed(1)}%` : "0%",
    ]);

  return {
    headers: ["Category", "Transactions", "Total", "% of Spend"],
    rows,
  };
}

const BUILDERS: Record<TemplateId, (expenses: Expense[]) => TemplateResult> = {
  detailed: buildDetailed,
  "tax-report": buildTaxReport,
  "monthly-summary": buildMonthlySummary,
  "category-analysis": buildCategoryAnalysis,
};

export function buildTemplateResult(
  templateId: TemplateId,
  expenses: Expense[]
): TemplateResult {
  return BUILDERS[templateId](expenses);
}
