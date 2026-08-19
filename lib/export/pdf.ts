import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export function buildExportPDF(expenses: Expense[]): Blob {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt" });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const marginLeft = 40;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Expense Report", marginLeft, 40);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    `Generated ${new Date().toLocaleString("en-US")}  •  ${
      expenses.length
    } record${expenses.length === 1 ? "" : "s"}  •  ${formatCurrency(
      total
    )} total`,
    marginLeft,
    58
  );

  autoTable(doc, {
    startY: 75,
    margin: { left: marginLeft, right: marginLeft },
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      formatDate(e.date),
      e.category,
      formatCurrency(e.amount),
      e.description,
    ]),
    headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    styles: { fontSize: 9, cellPadding: 6, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
    columnStyles: {
      2: { halign: "right" },
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Page ${page} of ${pageCount}`,
      marginLeft,
      doc.internal.pageSize.getHeight() - 20
    );
  }

  return doc.output("blob");
}
