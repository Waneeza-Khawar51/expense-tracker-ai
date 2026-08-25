# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

IMPORTANT:
1. Before you make any change, create and checkout a feature branch named "feature-some-short-name". Make and then commit your changes in this branch.
2. You must write automated tests for all code.
3. You must compile the code and pass ALL tests before committing.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (also type-checks the whole project)
npm run start    # run production build
npm run lint     # next lint (ESLint, extends next/core-web-vitals + next/typescript)
npm test         # run the Jest test suite once
npm test -- --watch   # watch mode
```

Jest is configured via `next/jest` (`jest.config.js`), uses the `jsdom` environment, and maps `@/*` the same way `tsconfig.json` does. `jest.setup.js` loads `@testing-library/jest-dom` matchers. Tests live alongside the code they cover in `__tests__/` directories (e.g. `lib/__tests__/monthlyInsights.test.ts`, `components/analytics/__tests__/MonthlyInsights.test.tsx`) — follow that convention for new tests rather than a top-level `tests/` folder.

Node version is pinned via `.nvmrc` to `18.20.8`.

## Architecture

This is a Next.js 14 App Router app that is entirely client-side — there is no backend, API routes, or database. All pages/components that touch state are marked `"use client"`.

**State and persistence**: All expense data flows through the `useExpenses` hook (`hooks/useExpenses.ts`), which is the single source of truth. It loads/saves the full `Expense[]` array to `localStorage` under the key `expense-tracker:expenses`, exposing `addExpense`/`updateExpense`/`deleteExpense`. There is no other data layer — new features that read or mutate expenses should go through this hook rather than accessing `localStorage` directly. Note the load/save effects are order-dependent: expenses are only persisted once `isLoaded` is true, to avoid clobbering storage with the initial empty state before the first load effect runs.

**Routes**: The App Router has four pages, all client components:
- `app/page.tsx` — the main screen. Owns UI-level state (active tab, filters, add-expense modal, export drawer) and derives `filteredExpenses` via `useMemo` from `useExpenses()` output + `ExpenseFilters` state. Renders either `Dashboard` (charts/summary) or `ExpenseList` (filtered table) depending on the active tab, and `ExpenseForm` inside a shared `Modal` for both adding and editing.
- `app/monthly-insights/page.tsx` — renders `components/analytics/MonthlyInsights.tsx`: current-month category breakdown plus the budget-streak calculation from `lib/monthlyInsights.ts`.
- `app/top-categories/page.tsx` and `app/top-vendors/page.tsx` — ranked breakdowns built on top of `lib/analytics.ts`'s range/trend utilities.

Each of these pages calls `useExpenses()` itself rather than receiving expenses as props — there is no shared layout-level data provider. Keep that pattern for new routes: call the hook where the page is defined, don't thread expenses through `app/layout.tsx`.

**Data model**: `lib/types.ts` defines `Expense`, `ExpenseInput` (an `Expense` without `id`/`createdAt`, used for create/update payloads), and the fixed `CATEGORIES` tuple (`Food`, `Transportation`, `Entertainment`, `Shopping`, `Bills`, `Other`) with matching `CATEGORY_COLORS`. Categories are a closed set — adding a category means updating this file, not a form dropdown elsewhere.

**Formatting utilities**: `lib/format.ts` has the shared `formatCurrency`, `formatDate`, and `todayISO()` helpers — reuse them rather than reformatting dates/currency inline. `formatDate` parses the `yyyy-MM-dd` string manually (not via `new Date(dateStr)`) specifically to avoid UTC/local timezone shift; follow the same approach if you add another date parser.

**Analytics**: `lib/analytics.ts` is the shared engine behind the dashboard/insights pages — range presets (`resolveRangePreset`), trend bucketing by month or year (`buildTrendBuckets`), period-over-period comparisons, and top/fastest-moving category calculations. `lib/monthlyInsights.ts` is narrower: current-month category breakdown and the "budget streak" (consecutive days at/under the user's own trailing 30-day daily average — there's no explicit budget-setting feature, so this is a derived proxy). Prefer extending these modules over duplicating date-bucketing or aggregation logic in a component.

**CSV/JSON/PDF export**: `lib/export/` is a small pipeline, not a single utility:
- `types.ts` — `ExportOptions`, `ExportStats`, `EXPORT_FORMATS` (`csv` | `json` | `pdf`).
- `filter.ts` — applies date-range/category scoping ahead of export.
- `stats.ts` — computes summary stats (count, total, average, per-category breakdown) included in JSON/PDF output.
- `serializers/{csv,json,pdf}.ts` — one serializer per format; `pdf.ts` uses `jspdf` + `jspdf-autotable`.
- `filename.ts` / `download.ts` — filename generation and the client-side Blob/object-URL download trigger.
- `index.ts` — the public entry point (`runExport`); it's the only file other code should import from. `runExport` awaits a `setTimeout(0)` deliberately, so PDF generation always has a real async boundary for callers to drive a loading state off — don't remove that when refactoring.

`components/export/ExportDrawer.tsx` (and its sibling components) is the UI on top of this pipeline, opened from both the dashboard header and the expense list.

**Components**: `components/ui/` holds generic primitives (`Button`, `Card`, `Modal`, `Drawer`) with no domain knowledge of expenses. `components/` (`Dashboard`, `ExpenseList`, `ExpenseForm`, `ExpenseFilters`, `CategoryBadge`) holds domain components that compose the primitives and receive expenses/callbacks as props — none of them call `useExpenses` themselves. `components/analytics/` and `components/export/` are feature-scoped subdirectories following the same prop-driven pattern (charts/lists take computed data as props; they don't fetch or compute analytics themselves beyond simple derivations).

**Styling**: Tailwind CSS, configured to scan `app/`, `components/`, and `pages/`. `tsconfig.json` maps `@/*` to the repo root, so imports use `@/lib/...`, `@/components/...`, `@/hooks/...`.

**Charts**: `recharts` is the charting library used throughout `components/analytics/` (and `Dashboard.tsx`). `CATEGORY_STACK_ORDER` and `LINE_DASH_PATTERNS` in `lib/analytics.ts` exist so that visually-similar category colors are never adjacent in a stack/legend, and series stay distinguishable without color (dash patterns) — keep using these constants rather than hardcoding category order/styling in a new chart.
