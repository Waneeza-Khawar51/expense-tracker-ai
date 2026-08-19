import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { ExportOptions, ExportStats } from "../types";

const MARGIN = 40;
const INDIGO = [79, 70, 229] as const;
const SLATE_900 = [15, 23, 42] as const;
const SLATE_500 = [100, 116, 139] as const;
const SLATE_400 = [148, 163, 184] as const;

function describeScope(
  options: Pick<ExportOptions, "startDate" | "endDate" | "categories">
): string {
  const parts: string[] = [];
  if (options.startDate || options.endDate) {
    parts.push(
      `${options.startDate ? formatDate(options.startDate) : "the beginning"} – ${
        options.endDate ? formatDate(options.endDate) : "today"
      }`
    );
  } else {
    parts.push("All dates");
  }
  parts.push(
    options.categories.length > 0 ? options.categories.join(", ") : "All categories"
  );
  return parts.join("  •  ");
}

export function buildExportPDFBlob(
  expenses: Expense[],
  options: Pick<ExportOptions, "startDate" | "endDate" | "categories">,
  stats: ExportStats
): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt" });

  doc.setFontSize(16);
  doc.setTextColor(...SLATE_900);
  doc.text("Expense Report", MARGIN, 40);

  doc.setFontSize(9);
  doc.setTextColor(...SLATE_500);
  doc.text(
    `Generated ${new Date().toLocaleString("en-US")}  •  ${stats.count} record${
      stats.count === 1 ? "" : "s"
    }  •  ${formatCurrency(stats.total)} total`,
    MARGIN,
    58
  );
  doc.text(describeScope(options), MARGIN, 71);

  autoTable(doc, {
    startY: 88,
    margin: { left: MARGIN, right: MARGIN },
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      formatDate(e.date),
      e.category,
      formatCurrency(e.amount),
      e.description,
    ]),
    headStyles: { fillColor: [...INDIGO] },
    styles: { fontSize: 9, cellPadding: 6, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      2: { halign: "right" },
    },
  });

  if (stats.byCategory.length > 1) {
    const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY;
    const breakdownY = afterTableY + 24;

    doc.setFontSize(11);
    doc.setTextColor(...SLATE_900);
    doc.text("Breakdown by Category", MARGIN, breakdownY);

    autoTable(doc, {
      startY: breakdownY + 8,
      margin: { left: MARGIN, right: MARGIN },
      head: [["Category", "Records", "Total"]],
      body: stats.byCategory.map((c) => [
        c.category,
        String(c.count),
        formatCurrency(c.total),
      ]),
      headStyles: { fillColor: [100, 116, 139] },
      styles: { fontSize: 9, cellPadding: 6, textColor: [30, 41, 59] },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
      },
      tableWidth: 260,
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(...SLATE_400);
    doc.text(
      `Page ${page} of ${pageCount}`,
      MARGIN,
      doc.internal.pageSize.getHeight() - 20
    );
  }

  return doc.output("blob");
}
