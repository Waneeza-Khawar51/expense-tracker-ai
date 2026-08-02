"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { Dashboard } from "@/components/Dashboard";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseFilters, Filters } from "@/components/ExpenseFilters";
import { ExpenseForm } from "@/components/ExpenseForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { downloadCSV } from "@/lib/csv";
import { CloudExportHub } from "@/components/cloud/CloudExportHub";

type Tab = "dashboard" | "expenses";

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "All",
  startDate: "",
  endDate: "",
};

export default function Home() {
  const { expenses, isLoaded, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCloudExportOpen, setIsCloudExportOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        if (
          filters.search &&
          !e.description.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }
        if (filters.category !== "All" && e.category !== filters.category) {
          return false;
        }
        if (filters.startDate && e.date < filters.startDate) {
          return false;
        }
        if (filters.endDate && e.date > filters.endDate) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [expenses, filters]);

  const navItemClasses = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100"
    }`;

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">
              Expense Tracker
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setTab("dashboard")}
                className={navItemClasses(tab === "dashboard")}
              >
                Dashboard
              </button>
              <button
                onClick={() => setTab("expenses")}
                className={navItemClasses(tab === "expenses")}
              >
                Expenses
              </button>
            </nav>
            <Button
              variant="secondary"
              onClick={() => setIsCloudExportOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.5 13a4.5 4.5 0 01-.416-8.984A5.5 5.5 0 0115.9 6.02 3.5 3.5 0 0115 13H5.5z" />
              </svg>
              Cloud Export
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === "dashboard" ? (
          <Dashboard expenses={expenses} />
        ) : (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col gap-4">
                <ExpenseFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                />
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-500">
                    Showing {filteredExpenses.length} of {expenses.length}{" "}
                    expense{expenses.length === 1 ? "" : "s"}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={filteredExpenses.length === 0}
                    onClick={() => downloadCSV(filteredExpenses)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Export CSV
                  </Button>
                </div>
              </div>
            </Card>

            <ExpenseList
              expenses={filteredExpenses}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
            />
          </div>
        )}
      </main>

      <Modal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          onSubmit={(input) => {
            addExpense(input);
            setIsAddOpen(false);
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <CloudExportHub
        open={isCloudExportOpen}
        onClose={() => setIsCloudExportOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}
