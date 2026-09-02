# Kanban Designer — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Card description field** — serves signal #2. Multi-line notes per card: `<textarea>` in card edit mode, 1-line truncated preview on the card face, round-trips through JSON export and `kanban-designer:currentBoard`. [Issue #43](https://github.com/agile-toolkit/kanban-designer/issues/43) — `needs-review`, open since 2026-06-27, past the 7-day auto-approve threshold.
2. **E2: Keyboard shortcuts help overlay** — serves signal #1 (usability for training/workshop contexts). `?` key / toolbar button opens a modal listing all keyboard shortcuts (Navigation / Card actions / Board actions). [Issue #44](https://github.com/agile-toolkit/kanban-designer/issues/44) — `needs-review`, open since 2026-06-27, past the 7-day auto-approve threshold.

## Recently shipped
**Fix icon-button accessibility gaps** (2026-09-02) — see `## Shipped`. A suite-wide UX audit flagged several icon-only "✕" buttons with no `aria-label` and low-contrast `text-gray-200`/`gray-300` styling, plus a copy-paste bug (the due-date-clear button's tooltip read "No color"). Fixed across `ColumnCard.tsx`, `BoardDesigner.tsx`, and `StatsPanel.tsx`.

**Fix: invisible brand-color borders/backgrounds + data-layer tests** (2026-09-02) — see `## Shipped`. The `border-brand-200` gap flagged in this file's own Polish backlog turned out to be broader once checked against every usage: `brand-800`/`brand-900` were also undefined and used in 9 more places (HomeScreen's WIP explainer, ColumnCard tags, AppHeader's active-nav pill) — 11 invisible-color occurrences across 5 files total, not just the 2 toolbar buttons originally noted. Completed the `brand` scale with Tailwind's own `orange` values (the source the existing 6 shades were already drawn from) rather than patching each call site individually.

**E3: Export board as CSV** (2026-09-02) — see `## Shipped`. Also flattens `column.subColumns` (not anticipated in the original issue) and includes cards from collapsed columns, since a data export shouldn't silently drop rows. [#45](https://github.com/agile-toolkit/kanban-designer/issues/45)

## Repo cleanup (2026-09-02)
Closed 22 stale `approved`/`needs-review` issues (#2–#39, #41–#42) that were already implemented — confirmed against this file's `## Shipped` list and, for the cross-app integrations, directly against source before closing. Only #43/#44 (E1/E2 above) remain genuinely open.

## Polish backlog
No small un-filed items queued.

## Shipped
- ~~Board editor — columns, cards, WIP limits, import/export JSON~~
- ~~Template gallery — 10 board archetypes with educational context~~
- ~~EN/ES/BE/RU localization with in-app language switcher~~
- ~~Card drag-and-drop within and between columns (`@dnd-kit`)~~
- ~~Board image export (PNG snapshot)~~
- ~~Card colour labels~~
- ~~Shareable board URL (state encoded in URL fragment)~~
- ~~Swim lane rows~~
- ~~WIP limit progress bar~~
- ~~Keyboard accessibility (ARIA roles, arrow/Enter/Delete navigation, skip link)~~
- ~~Card search and filter (text, colour, swim lane)~~
- ~~Unified AppHeader + language picker~~
- ~~Light/dark theme~~
- ~~Undo/redo (Ctrl+Z / Ctrl+Y, 50-entry history)~~
- ~~Card due dates with overdue highlighting~~
- ~~Column collapse/expand~~
- ~~Card tags with tag filter~~
- ~~Team Identity member assignment on cards~~
- ~~Board statistics panel~~
- ~~Card aging (time-in-column badge)~~
- ~~Save board as custom template~~
- ~~Card checklists with progress badge~~
- ~~Integrations: Dashboard `lastSession` key, Sprint Metrics deep-link, Planning Poker `currentBoard` key~~

**v0.2.0 — [E3: Export board as CSV](https://github.com/agile-toolkit/kanban-designer/issues/45)** (2026-09-02):
- ~~"Export CSV" toolbar button — one row per card (Column, Swim Lane,
  Title, Description, Colour, Due Date, Overdue), Blob-download~~

**v0.2.1 — Fix invisible brand-color borders/backgrounds + data-layer tests** (2026-09-02):
- ~~Completed the `brand` Tailwind color scale (200/800/900 were missing,
  used in 11 places across 5 files) — invisible borders/backgrounds/text
  in both light and dark mode~~
- ~~Added `vitest` + `jsdom`; `src/data/templates.test.ts`~~

**v0.2.2 — Fix icon-button accessibility gaps** (2026-09-02):
- ~~Added `aria-label` to icon-only ✕ buttons missing one (tag/checklist
  remove, column delete ×2, swim-lane delete, stats-panel close)~~
- ~~Fixed the due-date-clear button's tooltip, a copy-paste leftover
  reading "No color"~~
- ~~Bumped low-contrast delete-icon colors from `gray-200`/`gray-300` to
  `gray-400`/`gray-500`~~
