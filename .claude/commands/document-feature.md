---
description: Generate developer and end-user documentation for a feature
argument-hint: <feature-name>
---

# Document Feature

Generate a paired set of documentation for the feature named: **$ARGUMENTS**

## Step 1 — Resolve the feature

- Slugify `$ARGUMENTS` to kebab-case → `<slug>` (e.g. `CSV Export` → `csv-export`). Use `<slug>` in every filename and cross-link below.
- Derive a human-readable title from `$ARGUMENTS` (Title Case) for headings.
- Find the code that implements it: grep/glob `app/`, `components/`, `hooks/`, and `lib/` for matching component names, hook names, filenames, and string literals related to `$ARGUMENTS`.
- If nothing matches, stop and ask the user which files implement the feature rather than guessing or inventing behavior.

## Step 2 — Classify the feature

Based on the files found in Step 1, classify the feature as one of:

- **Frontend** — only `components/**` and `app/**/*.tsx` (UI, hooks, local state)
- **Backend** — only `app/api/**/route.ts`, server actions, or server-only `lib/` logic, with no UI
- **Full-stack** — touches both

This project currently has no `app/api` routes — data lives in the browser via the `useExpenses` hook / localStorage (see `hooks/useExpenses.ts`, `lib/types.ts`). Most features here will classify as **frontend**; only treat something as backend/full-stack if it genuinely adds a route handler, server action, or external API call. Use this classification to decide which sections to include in Steps 3–4.

## Step 3 — Developer documentation

File: `docs/dev/<slug>-implementation.md`

Create `docs/dev/` if it doesn't exist yet. Include only sections relevant to the Step 2 classification, citing real file paths and line numbers (`components/Foo.tsx:42`) — never invent APIs, props, or endpoints that aren't in the code:

- **Overview** — what the feature does and why, in one paragraph
- **Architecture** — component tree / data flow; state management approach (local state, `useExpenses`, context)
- **API details** (backend/full-stack only) — route handlers, request/response shapes, status codes, error handling
- **Frontend implementation** (frontend/full-stack only) — key components, props, hooks consumed, where the feature is mounted in the tree
- **Data model** — relevant types from `lib/types.ts`, storage mechanism (e.g. localStorage key/shape)
- **Implementation notes** — edge cases, known limitations, `TODO`/`FIXME` comments found in the code
- **Testing** — how to exercise it manually; note explicitly if there is no automated test coverage
- **Related documentation** — link to the paired guide at `../user/how-to-<slug>.md`, plus any other `docs/dev/*.md` file whose code shares components, hooks, or types with this feature (grep `docs/dev/` for those file paths)

## Step 4 — User documentation

File: `docs/user/how-to-<slug>.md`

Create `docs/user/` if it doesn't exist yet. Write for a non-technical end user:

- **What is [Feature]?** — one or two plain-language sentences, no jargon
- **Step-by-step instructions** — numbered steps that match the actual UI flow discovered in Step 1 (real button labels, field names, and copy pulled from the component's JSX — not placeholder text)
- **Screenshots** — after each key step, insert:
  `![Step N: <short caption>](./screenshots/<slug>-step-N.png)`
  followed by `<!-- TODO: capture screenshot of <specific UI state> -->`.
  If Chrome browser automation is available, offer to start the dev server and actually capture real screenshots into `docs/user/screenshots/<slug>-step-N.png` instead of leaving placeholders — confirm with the user before starting a server or navigating a browser on their behalf.
- **Tips / FAQ** — only include items that are actually evidenced by the code (validation rules, limits, error states)
- **Related guides** — link to other `docs/user/*.md` files covering adjacent features, and to `../dev/<slug>-implementation.md` for readers who want implementation detail

## Step 5 — Cross-link

- Add a "Related documentation" section to both new files linking to each other via relative path.
- Grep existing files under `docs/dev/` and `docs/user/` for references to the same components, hooks, types, or routes; link to those as "Related" entries, and add a backlink in *their* Related section too.

## Step 6 — Report

List the file(s) created or updated and state the Step 2 classification (frontend/backend/full-stack) in one line.
