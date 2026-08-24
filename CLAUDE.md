# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

IMPORTANT:
1. Before you make any change, create and checkout a feature branch named "feature-some-short-name". Make and then commit your changes in this branch.
2. You must write automated tests for all code.
3. You must compile the code and pass ALL tests before committing.



## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint (ESLint, extends next/core-web-vitals + next/typescript)
```

There is no test suite or test runner configured in this project. Node version is pinned via `.nvmrc` to `18.20.8`.

## Architecture

This is a Next.js 14 App Router app that is entirely client-side — there is no backend, API routes, or database. All pages/components that touch state are marked `"use client"`.

**State and persistence**: All expense data flows through the `useExpenses` hook (`hooks/useExpenses.ts`), which is the single source of truth. It loads/saves the full `Expense[]` array to `localStorage` under the key `expense-tracker:expenses`, exposing `addExpense`/`updateExpense`/`deleteExpense`. There is no other data layer — new features that read or mutate expenses should go through this hook rather than accessing `localStorage` directly. Note the load/save effects are order-dependent: expenses are only persisted once `isLoaded` is true, to avoid clobbering storage with the initial empty state before the first load effect runs.

**Page composition**: `app/page.tsx` is the only route. It owns UI-level state (active tab, filters, add-expense modal) and derives `filteredExpenses` via `useMemo` from `useExpenses()` output + `ExpenseFilters` state. It renders either `Dashboard` (charts/summary) or `ExpenseList` (filtered table) depending on the active tab, and `ExpenseForm` inside a shared `Modal` for both adding and editing.

**Data model**: `lib/types.ts` defines `Expense`, `ExpenseInput` (an `Expense` without `id`/`createdAt`, used for create/update payloads), and the fixed `CATEGORIES` tuple (`Food`, `Transportation`, `Entertainment`, `Shopping`, `Bills`, `Other`) with matching `CATEGORY_COLORS`. Categories are a closed set — adding a category means updating this file, not a form dropdown elsewhere.

**Formatting utilities**: `lib/format.ts` (currency/date formatting, `todayISO()`) and `lib/csv.ts` (`expensesToCSV`, `downloadCSV` — client-side CSV export via a Blob/object URL, no server round-trip) are the shared utilities; reuse them rather than reformatting dates/currency inline.

**Components**: `components/ui/` holds generic primitives (`Button`, `Card`, `Modal`) with no domain knowledge of expenses. `components/` (Dashboard, ExpenseList, ExpenseForm, ExpenseFilters, CategoryBadge) holds domain components that compose the primitives and receive expenses/callbacks as props from `app/page.tsx` — none of them call `useExpenses` themselves.

**Styling**: Tailwind CSS, configured to scan `app/`, `components/`, and `pages/`. `tsconfig.json` maps `@/*` to the repo root, so imports use `@/lib/...`, `@/components/...`, `@/hooks/...`.
