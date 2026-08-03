# Changelog

All notable changes to this project are recorded here, newest first.
Entries are appended automatically by a local git `post-commit` hook every time a commit is made.

<!-- new entries are inserted below this line, do not remove -->

## 2026-08-03 12:02 — Nina Lacks

**Move changelog hook to Husky so it's shared via the repo**

- A	.husky/post-commit
- M	package-lock.json
- M	package.json

## 2026-08-03 11:58 — Nina Lacks

**Fix changelog hook to pin intro text above the marker**

- M	CHANGELOG.md

## 2026-08-03 11:57 — Nina Lacks

**Add CHANGELOG.md and post-commit hook for automatic updates**

- A	CHANGELOG.md

## 2026-08-03 11:51 — Nina Lacks

**Merge remote initial commit (placeholder README)**

- Merged the GitHub-generated placeholder repo (initial `README.md`) with local history.

## 2026-08-03 11:44 — Nina Lacks

**Scaffold WFA KOMPASS Schedule app and build Viewer homepage**

- Scaffolded Next.js + TypeScript + Tailwind CSS v4 + Storybook + Radix UI.
- Built the read-only Published KOMPASS Schedule (Viewer) homepage: header, action bar
  (download/save filter/history), 9-filter filter panel, sortable schedule table.
- Added static mock data module, client-side filtering/sorting, localStorage-backed
  saved filters, and CSV/PDF export.

## 2026-08-03 11:40 — Nina Lacks

**Initial commit**

- Repository created on GitHub with a placeholder `README.md`.
