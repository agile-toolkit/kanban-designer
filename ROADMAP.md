# Kanban Designer — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Card description field** — serves #2. Multi-line notes per card: `<textarea>` in card edit mode, 1-line truncated preview on the card face, round-trips through JSON export and `kanban-designer:currentBoard`. [Issue #43](https://github.com/agile-toolkit/kanban-designer/issues/43) — `needs-review`, open since 2026-06-27, past the 7-day auto-approve threshold.
2. **E2: Keyboard shortcuts help overlay** — serves #5. `?` key / toolbar button opens a modal listing all keyboard shortcuts (Navigation / Card actions / Board actions). [Issue #44](https://github.com/agile-toolkit/kanban-designer/issues/44) — `needs-review`, open since 2026-06-27, past the 7-day auto-approve threshold.
3. **E3: Export board as CSV** — serves #3. Spreadsheet-ready card list (Column, Swim Lane, Title, Description, Colour, Due Date, Overdue), Blob-download `<board-name>-kanban.csv`. [Issue #45](https://github.com/agile-toolkit/kanban-designer/issues/45) — `needs-review`, open since 2026-06-27, past the 7-day auto-approve threshold.

## Polish backlog
- None currently filed — all open non-epic issues are either already implemented (awaiting human close, see Shipped below) or covered by E1–E3 above.

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
