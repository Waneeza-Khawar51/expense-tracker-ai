"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency } from "@/lib/format";
import { Card } from "@/components/ui/Card";

const UNKNOWN_VENDOR = "Unknown";
const MAX_CHART_VENDORS = 10;

interface VendorSummary {
  vendor: string;
  total: number;
  count: number;
  share: number;
}

export default function TopVendorsPage() {
  const { expenses, isLoaded } = useExpenses();

  const vendors = useMemo<VendorSummary[]>(() => {
    if (expenses.length === 0) return [];

    const totals = new Map<string, { total: number; count: number }>();
    let grandTotal = 0;

    for (const expense of expenses) {
      const vendor = expense.description.trim() || UNKNOWN_VENDOR;
      const existing = totals.get(vendor) ?? { total: 0, count: 0 };
      existing.total += expense.amount;
      existing.count += 1;
      totals.set(vendor, existing);
      grandTotal += expense.amount;
    }

    return Array.from(totals.entries())
      .map(([vendor, { total, count }]) => ({
        vendor,
        total,
        count,
        share: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const chartData = useMemo(
    () =>
      vendors.slice(0, MAX_CHART_VENDORS).map((v) => ({
        vendor: v.vendor,
        total: v.total,
      })),
    [vendors]
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span className="text-sm">Loading your expenses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">Top Vendors</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {vendors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-slate-600">
              No spending data yet
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Add some expenses to see which vendors you spend the most with.
            </p>
          </Card>
        ) : (
          <>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-700">
                Top {Math.min(vendors.length, MAX_CHART_VENDORS)} Vendors by
                Spend
              </h3>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                      dataKey="vendor"
                      type="category"
                      width={120}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        borderRadius: 8,
                        borderColor: "#e2e8f0",
                        fontSize: 13,
                      }}
                    />
                    <Bar
                      dataKey="total"
                      fill="#6366f1"
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-700">
                All Vendors
              </h3>
              <ul className="mt-4 divide-y divide-slate-100">
                {vendors.map((v, i) => (
                  <li
                    key={v.vendor}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {v.vendor}
                        </p>
                        <p className="text-xs text-slate-400">
                          {v.count} expense{v.count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="flex-none text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {formatCurrency(v.total)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {v.share.toFixed(1)}% of spend
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
