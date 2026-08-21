# Changelog

All notable changes to this project are recorded here, newest first.
Entries are appended automatically by a local git `post-commit` hook every time a commit is made.

<!-- new entries are inserted below this line, do not remove -->

## 2026-08-21 13:08 — Nina Lacks

**Add schedule versioning, published-status lifecycle, and History of Changes**

- A	components.json
- A	docs/Draft_vs_Published_Requirements_Creators_and_Reviewers.docx
- M	package-lock.json
- M	package.json
- A	src/app/design-system/page.tsx
- M	src/app/globals.css
- M	src/app/layout.tsx
- M	src/components/layout/PageHeader.stories.tsx
- M	src/components/layout/PageHeader.tsx
- A	src/components/mx/MXBadge.tsx
- A	src/components/mx/MXButton.tsx
- A	src/components/mx/MXCard.tsx
- A	src/components/mx/MXDataTable.tsx
- A	src/components/mx/MXDialog.tsx
- A	src/components/mx/MXInput.tsx
- A	src/components/mx/MXSelect.tsx
- A	src/components/mx/index.ts
- M	src/components/schedule/ActionBar.stories.tsx
- M	src/components/schedule/ActionBar.tsx
- A	src/components/schedule/EditEntryDialog.tsx
- M	src/components/schedule/FilterPanel.tsx
- A	src/components/schedule/HistoryView.tsx
- A	src/components/schedule/NewEntryDialog.tsx
- A	src/components/schedule/PeriodWeekPicker.tsx
- M	src/components/schedule/PublishedSchedulePage.tsx
- A	src/components/schedule/RemoveEntryDialog.tsx
- M	src/components/schedule/ScheduleHeader.stories.tsx
- M	src/components/schedule/ScheduleHeader.tsx
- M	src/components/schedule/ScheduleTable.tsx
- M	src/components/ui/Badge.stories.tsx
- M	src/components/ui/Badge.tsx
- D	src/components/ui/Button.tsx
- M	src/components/ui/MultiSelect.tsx
- A	src/components/ui/Switch.tsx
- R064	src/components/ui/Button.stories.tsx	src/components/ui/button.stories.tsx
- A	src/components/ui/button.tsx
- A	src/components/ui/card.tsx
- A	src/components/ui/dialog.tsx
- A	src/components/ui/input.tsx
- A	src/components/ui/select.tsx
- A	src/components/ui/shadcn-badge.tsx
- A	src/components/ui/table.tsx
- M	src/lib/format.ts
- A	src/lib/history.ts
- A	src/lib/mock/creators.ts
- A	src/lib/mock/publish-log.ts
- M	src/lib/mock/schedule-data.ts
- M	src/lib/schedule-filters.ts
- A	src/lib/utils.ts
- A	src/styles/mx-theme.css
- M	src/types/schedule.ts

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
