"use client";

import { useState } from "react";
import { Expense, ExpenseInput } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Modal } from "@/components/ui/Modal";
import { ExpenseForm } from "@/components/ExpenseForm";
import { Button } from "@/components/ui/Button";

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: (id: string, input: ExpenseInput) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onUpdate, onDelete }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-slate-600">
          No expenses found
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Try adjusting your filters or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  <div className="max-w-[240px] truncate sm:max-w-xs">
                    {expense.description}
                  </div>
                  <div className="mt-1 sm:hidden">
                    <CategoryBadge category={expense.category} />
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm sm:table-cell">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      aria-label={`Edit expense: ${expense.description}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeletingExpense(expense)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete expense: ${expense.description}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            initialValues={editingExpense}
            submitLabel="Save Changes"
            onCancel={() => setEditingExpense(null)}
            onSubmit={(input) => {
              onUpdate(editingExpense.id, input);
              setEditingExpense(null);
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        title="Delete Expense"
      >
        {deletingExpense && (
          <div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                &ldquo;{deletingExpense.description}&rdquo;
              </span>{" "}
              for {formatCurrency(deletingExpense.amount)}? This cannot be
              undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeletingExpense(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(deletingExpense.id);
                  setDeletingExpense(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
