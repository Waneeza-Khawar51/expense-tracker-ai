---
description: Create and check out a properly-named feature branch before starting work
argument-hint: <short-description>
---

# Start Feature

Set up a new feature branch for: **$ARGUMENTS**

This exists to make CLAUDE.md rule 1 ("create and checkout a feature branch named
`feature-some-short-name` before making any change") automatic instead of something
to remember every time.

## Step 1 — Check for in-progress work

Run `git status`. If there are uncommitted changes (staged or unstaged) or untracked
files that look like work in progress, stop and ask the user whether to commit, stash
(`git stash -u`), or discard them before switching branches. Never discard or stash
without asking first.

## Step 2 — Resolve the branch name

- If `$ARGUMENTS` is empty, ask the user for a short description rather than inventing one.
- Slugify it to lowercase kebab-case, 2-5 words (e.g. "add dark mode toggle" → `dark-mode-toggle`). Drop filler words like "add"/"the"/"feature" since the prefix already says "feature".
- Branch name is `feature-<slug>` — dash-separated, matching the exact convention in CLAUDE.md (not `feature/<slug>`).
- If a branch with that name already exists locally or on `origin`, ask the user whether to check it out instead of creating a new one, or pick a different slug.

## Step 3 — Sync the base branch

- Note the current branch. If it isn't `main`, and the working tree is clean (confirmed in Step 1), checkout `main`.
- Run `git pull` to get the latest `main`. If the pull fails or there's a conflict, stop and report it rather than forcing anything.

## Step 4 — Create and checkout the branch

Run `git checkout -b feature-<slug>` from the up-to-date `main`.

## Step 5 — Confirm

Run `git branch --show-current` to confirm the new branch is active, and report the
branch name to the user. Remind them (briefly, one line) that CLAUDE.md also requires
automated tests for any new code and a passing build + test run before committing.
