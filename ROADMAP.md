# Kanban Designer — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
None — idle. Both epics from `needs-review` have shipped; see `## Recently shipped`.

## Recently shipped
**Keyboard shortcuts help overlay** (2026-09-05) — see `## Shipped`. `?` key / toolbar button opens a centered modal listing all keyboard shortcuts (Navigation / Card actions / Board actions), plus a Mouse & touch section since not every action is keyboard-driven. Every shortcut listed was already implemented — this ships the discoverability, not new behaviour. Closes [Issue #44](https://github.com/agile-toolkit/kanban-designer/issues/44).

**Card description field** (2026-09-05) — see `## Shipped`. Multi-line notes per card: `<textarea>` in card edit mode, 1-line truncated preview on the card face, round-trips through JSON export/import since `KanbanCard.description` already existed on the type. Closes [Issue #43](https://github.com/agile-toolkit/kanban-designer/issues/43).
**Remove Track mode entirely** (2026-09-05) — see `## Shipped`. Reverses
the 2026-09-03 Design/Track split below: rather than gating execution
fields behind a toggle, they're removed from this app altogether. Kanban
Tracker has since shipped full parity for the capability (card CRUD, a
stats panel, and drag-and-drop card movement — all against boards
imported from here via the canonical schema), so keeping a second,
partial copy of the same functionality in Designer no longer serves a
purpose and just re-opens the "does it design or does it track?"
confusion the split was meant to fix. Removed: the Design/Track toggle,
`KanbanBoard.mode`/`resolveBoardMode()` (`src/boardMode.ts`, deleted),
due-date/assignee/checklist/card-aging display and editing in
`ColumnCard.tsx`, the assignee filter and team-member lookup in
`BoardDesigner.tsx`, `StatsPanel.tsx` (deleted), and the two
now-unconditional CSV columns. `KanbanCard`'s `dueDate`/`assignee`/
`checklist`/`enteredColumnAt` fields stay in `types.ts` as optional,
never-edited pass-through — a board round-tripped through Tracker and
back into Designer for a redesign doesn't lose that data, Designer just
never shows or touches it.

**Canonical board export/import schema** (2026-09-04) — see `## Shipped`. Serves the suite thesis's "platform depth" signal (GOAL.md): a shared team object model needs a shared board model too. Full JSON export/import and the `#board=` share link now wrap/unwrap a versioned `{ schema, version, board }` envelope (`src/utils/boardExport.ts`), documented in `BOARD_SCHEMA.md` (meta-repo) as the format any suite app should use to seed from a board designed here. Backward compatible: import paths still accept a bare board object, so Improvement Board's existing `?prefill=` sender needs no change. Direct follow-up to the user's clarified direction on the earlier "split Kanban Designer" discussion — Track mode stays in this app; the new `kanban-tracker` app (and any domain-specific tracker) consumes designed boards through this schema instead.

**Add glass effect to the header** (2026-09-04) — see `## Shipped`. `AppHeader.tsx`'s background changed to a translucent blur, matching the Dashboard's own nav — user-reported inconsistency.

**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `useFacilitatorMode`'s storage key changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request.

**Replace decorative ✕/✓ emoji with SVG icons** (2026-09-03) — see `## Shipped`. First app in a suite-wide emoji→SVG sweep the user asked for; this app had the highest raw count (15 occurrences across 4 files).

**Facilitator Mode** (2026-09-03) — see `## Shipped`. A user asked for the presentation/projector mode already built for Team Identity to be adopted suite-wide; this is repo 4 of an 11-repo rollout, adopting the pattern now shared in `design-system/`.

**Split Design mode from Track mode** (2026-09-03) — see `## Shipped`. `GOAL.md` draws a hard boundary ("not a board execution tool") that due dates, assignee, checklists, card aging, and a stats panel had, in aggregate, quietly crossed — each shipped separately as a reasonable-looking addition, but the app had become a second product the README never described. A user flagged the resulting "does it design or does it track?" confusion directly. Added a Design/Track toggle; Design (default) is structure only, Track reveals the rest. Existing boards with real due-date/assignee/checklist data auto-open in Track mode so nothing is silently hidden.

**Receive Improvement Board's "Open in Kanban Designer" handoff** (2026-09-03) — see `## Shipped`. A suite-wide cross-app link audit found Improvement Board has sent a full board via `?prefill=` since it shipped, but nothing here ever read it. Now consumed as a fallback to the existing `#board=` hash import.

**Fix LanguagePicker dark mode** (2026-09-02) — see `## Shipped`. The design-system's canonical `LanguagePicker.tsx` never got dark-mode classes; this app's copy inherited the gap. Synced with the now-fixed design-system source.

**Fix icon-button accessibility gaps** (2026-09-02) — see `## Shipped`. A suite-wide UX audit flagged several icon-only "✕" buttons with no `aria-label` and low-contrast `text-gray-200`/`gray-300` styling, plus a copy-paste bug (the due-date-clear button's tooltip read "No color"). Fixed across `ColumnCard.tsx`, `BoardDesigner.tsx`, and `StatsPanel.tsx`.

**Fix: invisible brand-color borders/backgrounds + data-layer tests** (2026-09-02) — see `## Shipped`. The `border-brand-200` gap flagged in this file's own Polish backlog turned out to be broader once checked against every usage: `brand-800`/`brand-900` were also undefined and used in 9 more places (HomeScreen's WIP explainer, ColumnCard tags, AppHeader's active-nav pill) — 11 invisible-color occurrences across 5 files total, not just the 2 toolbar buttons originally noted. Completed the `brand` scale with Tailwind's own `orange` values (the source the existing 6 shades were already drawn from) rather than patching each call site individually.

**E3: Export board as CSV** (2026-09-02) — see `## Shipped`. Also flattens `column.subColumns` (not anticipated in the original issue) and includes cards from collapsed columns, since a data export shouldn't silently drop rows. [#45](https://github.com/agile-toolkit/kanban-designer/issues/45)

## Repo cleanup (2026-09-02)
Closed 22 stale `approved`/`needs-review` issues (#2–#39, #41–#42) that were already implemented — confirmed against this file's `## Shipped` list and, for the cross-app integrations, directly against source before closing. Only #43/#44 (E1/E2 above) remain genuinely open.

## Polish backlog
No small un-filed items queued.

## Shipped
- ~~Keyboard shortcuts help overlay — `?` key / toolbar button opens a
  modal listing Navigation / Card actions / Board actions / Mouse &
  touch shortcuts~~ (2026-09-05)
- ~~Card description field — multi-line notes per card, editable via a
  textarea in card edit mode, truncated preview on the card face~~
  (2026-09-05)
- ~~Remove Track mode entirely — due dates, assignee, checklist, card
  aging, and the stats panel, superseded by Kanban Tracker's own full
  execution capability~~ (2026-09-05)
- ~~Canonical `{ schema, version, board }` export/import envelope for full-fidelity JSON export/import and the `#board=` share link, documented as `BOARD_SCHEMA.md` in the meta-repo~~
- ~~Add glass/backdrop-blur effect to the header, matching the Dashboard's own nav~~
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Replace decorative ✕/✓ text-glyph buttons with shared SVG icons~~
- ~~Facilitator Mode — bigger UI + hidden nav/language picker for in-room presentation, adopted from the shared design-system pattern~~
- ~~Design/Track mode split — due dates, assignee, checklist, card aging, and stats gated behind an explicit, off-by-default Track mode, restoring the "designs boards, does not run work" boundary~~
- ~~Receive Improvement Board's `?prefill=` board handoff (fallback to the existing `#board=` hash import)~~
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

**v0.2.3 — Fix LanguagePicker dark mode** (2026-09-02):
- ~~Synced `LanguagePicker.tsx` with the design-system's now-fixed
  canonical copy — full `dark:` coverage~~
