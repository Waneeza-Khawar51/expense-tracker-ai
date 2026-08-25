---
description: Scaffold a new analytics page following the monthly-insights / top-categories / top-vendors pattern
argument-hint: <route-name> [what it should show]
---

# New Analytics Route

Scaffold a new analytics page for: **$ARGUMENTS**

This app has three existing analytics routes — `app/monthly-insights/`,
`app/top-categories/`, `app/top-vendors/` — that all follow the same shape. New ones
should match it rather than inventing a new pattern.

## Step 0 — Branch

Per CLAUDE.md rule 1: if the current branch is `main`, create and checkout
`feature-<slug>-route` first (see `/start-feature`). If already on a feature branch,
continue on it.

## Step 1 — Resolve what to build

- Parse `$ARGUMENTS` into a route name and, if given, a description of what the page
  should show. If the description is missing or ambiguous about what data/metric the
  page displays, ask the user rather than inventing the analysis.
- Derive:
  - URL slug (kebab-case) → `app/<slug>/page.tsx`
  - Page component name (PascalCase + `Page`) → e.g. `SpendingByDayPage`
  - Feature component name (PascalCase, no `Page` suffix) → `components/analytics/<Name>.tsx`
  - Nav label (Title Case, short) for the header link

## Step 2 — Decide where the computation lives

Read `lib/analytics.ts` and `lib/monthlyInsights.ts` first. If the new page needs a
date-range/trend/comparison calculation that's a variant of something already there
(`buildTrendBuckets`, `computeRangeStats`, `resolveRangePreset`, etc.), extend the
relevant `lib/` module rather than writing new aggregation logic inline in the
component — that's the established boundary between data logic and presentation. Only
add a small one-off `useMemo` in the page itself (like `app/top-categories/page.tsx`
does) if the aggregation is genuinely simple and page-specific.

## Step 3 — Create the page

`app/<slug>/page.tsx`, matching the existing three pages:

- `"use client"`, calls `useExpenses()` itself (pages don't receive expenses as props —
  there's no shared data provider in `app/layout.tsx`).
- Same loading state while `!isLoaded` (copy the spinner block verbatim from
  `app/top-categories/page.tsx` for consistency).
- Same header: logo `Link` back to `/`, `<h1>` with the nav label, "← Back to Dashboard"
  link, wrapped in `max-w-6xl` — copy the structure from an existing page and change the
  title text.
- Empty state when there's no relevant data yet (see `app/top-categories/page.tsx`'s
  `data.length === 0` branch for the pattern: a centered `Card` with a short message).

## Step 4 — Create the component

`components/analytics/<Name>.tsx`:

- Accepts computed data as props (and `now?: Date` if it does any "current period"
  calculation, so tests can pass a fixed date — see `MonthlyInsights`'s signature).
- Does not call `useExpenses` itself.
- Use `Card` from `components/ui/` for layout and `recharts` for any chart, following
  `TopCategoriesChart`/`CategoryBreakdownChart` for chart conventions, and
  `CATEGORY_STACK_ORDER` / `CATEGORY_COLORS` / `LINE_DASH_PATTERNS` from
  `lib/analytics.ts` / `lib/types.ts` for category styling — don't hardcode colors.

## Step 5 — Wire up navigation

Add a `Link href="/<slug>"` to the header nav in `app/page.tsx`, alongside the existing
Monthly Insights / Top Categories / Top Vendors links, using the same class string.

## Step 6 — Tests

Add `components/analytics/__tests__/<Name>.test.tsx` using React Testing Library,
following `MonthlyInsights.test.tsx`:

- If the component charts with `recharts`, mock `ResponsiveContainer` to render its
  children directly (jsdom can't measure layout, so `recharts` renders nothing without
  this) — copy the `jest.mock("recharts", ...)` block.
- Pass a fixed `now` date rather than relying on the real clock.
- Cover the empty-data case and at least one populated case with real numbers asserted
  via `formatCurrency`-style output.

## Step 7 — Gate and report

Run `npm run lint`, `npm run build`, and `npm test` — all must pass before committing,
per CLAUDE.md rule 3. Report the files created/edited and the route path.
