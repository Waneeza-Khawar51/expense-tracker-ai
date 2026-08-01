"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, Category, ExpenseInput } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { Button } from "@/components/ui/Button";

interface ExpenseFormProps {
  initialValues?: ExpenseInput;
  onSubmit: (input: ExpenseInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

interface FormErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const [date, setDate] = useState(initialValues?.date ?? todayISO());
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount) : ""
  );
  const [category, setCategory] = useState<Category>(
    initialValues?.category ?? "Food"
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [justSubmitted, setJustSubmitted] = useState(false);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!date) {
      nextErrors.date = "Date is required";
    } else if (new Date(date) > new Date(todayISO() + "T23:59:59")) {
      nextErrors.date = "Date cannot be in the future";
    }

    const amountNum = Number(amount);
    if (!amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      nextErrors.amount = "Amount must be a positive number";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required";
    } else if (description.trim().length > 200) {
      nextErrors.description = "Description must be under 200 characters";
    }

    return nextErrors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      date,
      amount: Number(amount),
      category,
      description: description.trim(),
    });

    if (!initialValues) {
      setDate(todayISO());
      setAmount("");
      setCategory("Food");
      setDescription("");
    }
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 1500);
  }

  const inputClasses =
    "block w-full rounded-lg border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm";
  const errorInputClasses = "ring-red-400 focus:ring-red-500";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelClasses}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClasses} ${errors.date ? errorInputClasses : ""}`}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-error" : undefined}
          />
          {errors.date && (
            <p id="date-error" className="mt-1 text-xs text-red-600">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className={labelClasses}>
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
              $
            </span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${inputClasses} pl-6 ${errors.amount ? errorInputClasses : ""}`}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-xs text-red-600">
              {errors.amount}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="category" className={labelClasses}>
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={inputClasses}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <input
          id="description"
          type="text"
          placeholder="e.g. Grocery shopping at Whole Foods"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClasses} ${errors.description ? errorInputClasses : ""}`}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-xs text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {justSubmitted && (
          <span className="text-sm text-emerald-600 font-medium animate-pulse">
            Saved!
          </span>
        )}
      </div>
    </form>
  );
}
