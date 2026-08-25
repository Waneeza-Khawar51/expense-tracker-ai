---
description: Add a new expense category across every place the closed category set is defined
argument-hint: <category-name>
---

# Add Category

Add a new expense category: **$ARGUMENTS**

`CATEGORIES` in `lib/types.ts` is a closed set (currently Food, Transportation,
Entertainment, Shopping, Bills, Other). Several other constants are typed as
`Record<Category, ...>`, which is deliberate: TypeScript will fail the build if any of
them are missing the new category. Use that to your advantage rather than hunting for
every reference by hand.

## Step 0 — Branch

Per CLAUDE.md rule 1: if the current branch is `main` (check with
`git branch --show-current`), create and checkout `feature-add-<slug>-category` first
(see `/start-feature` for the same flow). If already on a feature branch, continue on it.

## Step 1 — Resolve the category name

- If `$ARGUMENTS` is empty, ask the user for the category name.
- Title-case it to match the existing style (`Food`, `Transportation`, ...) → `<Name>`.
- Read `lib/types.ts` and confirm `<Name>` isn't already in `CATEGORIES`. If it is, stop and tell the user.

## Step 2 — Update the data model (`lib/types.ts`)

- Add `<Name>` to the `CATEGORIES` tuple.
- Add an entry for `<Name>` to `CATEGORY_COLORS`. Pick a hex color that's visually distinct from the existing six swatches (`Food` #f97316, `Transportation` #3b82f6, `Entertainment` #a855f7, `Shopping` #ec4899, `Bills` #ef4444, `Other` #64748b) — don't reuse a nearby hue. Show the chosen color to the user.

## Step 3 — Update chart styling (`lib/analytics.ts`)

- Add `<Name>` to `CATEGORY_STACK_ORDER`. Read the comment above it: the order exists so
  that the two hardest-to-distinguish color pairs (Entertainment/Transportation and
  Bills/Food) are never adjacent in the stack or legend. Place `<Name>` so it doesn't
  create a new adjacent pair that's hard to tell apart from its chosen color, and explain
  the placement in one sentence.
- Add `<Name>` to `LINE_DASH_PATTERNS` with a dash pattern distinct from the other five
  (or `undefined` for a solid line — only one category should be `undefined`, currently
  `Entertainment`).

## Step 4 — Let the compiler find the rest

Run `npm run build`. Any other `Record<Category, ...>` map or exhaustive `switch` over
`Category` that's missing `<Name>` will fail to compile — fix each one it reports rather
than searching manually. Do not add a fallback/default case to silence these errors;
each category should be handled explicitly.

## Step 5 — Check tests for hardcoded assumptions

Grep `lib/__tests__` and `components/**/__tests__` for hardcoded category lists, counts
(e.g. asserting exactly 6 categories), or fixtures that enumerate all categories, and
update them to include `<Name>`. Add or extend a test that exercises `<Name>` specifically
if none of the existing tests would catch a regression in its handling (e.g. a chart or
breakdown test that iterates all categories).

## Step 6 — Gate and report

Run `npm run lint`, `npm run build`, and `npm test` — all must pass before committing,
per CLAUDE.md rule 3. Then summarize: the color and dash pattern chosen, the stack
position and why, and every file changed.
