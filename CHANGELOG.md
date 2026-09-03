# Changelog

All notable changes to Kanban Designer are documented here.

## Unreleased

## 0.3.0 — Split Design mode from Track mode (2026-09-03)

- **feature (product-scope fix)**: `GOAL.md` has always drawn a hard
  boundary — "Not a board execution tool; it designs boards, it does
  not run work" — and the whole competitive rationale rests on it
  ("Competitors run boards; almost none help design one"). Due dates
  with overdue highlighting, assignee, checklists with progress badges,
  card aging (`enteredColumnAt`, stamped on every drag), and a stats
  panel (completion rate, WIP-at-capacity, oldest card) had each
  shipped separately as small, reasonable-looking additions, and in
  aggregate quietly turned this into a live work-tracking tool the
  README never described — a user-reported "why does this both design
  boards and track tasks?" confusion, confirmed on inspection to be a
  real drift, not a wording problem.
- Added a per-board **Design / Track** toggle (`KanbanBoard.mode`,
  `'design'` by default) in the toolbar. Design mode is columns, WIP
  limits, swim lanes, and card content only — the "board design" the
  app is actually named for. Track mode reveals everything above.
  Switching modes never deletes data: fields set in Track mode stay on
  the card and reappear if Track mode is re-enabled.
- Boards saved before this shipped have no `mode` field.
  `resolveBoardMode()` (`src/boardMode.ts`, tested) infers `'track'`
  for those only if a card already has a due date, assignee, or
  non-empty checklist — never from `enteredColumnAt` alone, since
  that's stamped unconditionally on every card and would make almost
  every existing board with cards infer `'track'`. Applied on every
  load/import/share-link path, so a board someone was already actively
  tracking doesn't have its data silently hidden by this update.
- CSV export drops the Due Date/Overdue columns in Design mode.

## 0.2.4 — Receive Improvement Board's "Open in Kanban Designer" handoff (2026-09-03)

- **fix (broken integration)**: Improvement Board's `buildKanbanUrl()`
  has sent a fully-formed board as `?prefill=<JSON>&utm_source=` since
  it shipped, but Kanban Designer never read a query param at all — the
  link opened the app to an empty home screen. Found by a suite-wide
  cross-app link audit. Added `src/utils/prefillBoard.ts` (`parsePrefillBoard`,
  tested) and wired it in as a fallback to the existing `#board=` hash
  parser; the query param is stripped after import so a page refresh
  doesn't re-import the same board.

## 0.2.3 — Fix LanguagePicker dark mode (2026-09-02)

- **fix**: `LanguagePicker.tsx` had zero `dark:` classes — the
  design-system's canonical copy never got dark-mode classes, and this
  app's copy inherited the gap. Synced with the now-fixed design-system
  source.

## 0.2.2 — Fix icon-button accessibility gaps (2026-09-02)

- **fix**: several icon-only "✕" delete/remove buttons in `ColumnCard.tsx`
  (tag remove, checklist-item remove, column delete ×2) and
  `BoardDesigner.tsx` (swim-lane delete) had only a `title` attribute, or
  none at all — screen readers announce just "✕" with no `aria-label`.
  Added `aria-label` to all of them, plus `StatsPanel.tsx`'s close
  button.
- **fix**: the due-date-clear button in `ColumnCard.tsx`'s card editor
  reused the "No color" label as its `title`/tooltip — copy-paste leftover
  from the color-clear button above it. Added a dedicated
  `designer.clear_due_date` key.
- **fix**: several of the same delete buttons used `text-gray-200`/
  `gray-300`, below WCAG AA contrast and nearly invisible until hover.
  Bumped to `gray-400`/`gray-500`.
- Found via a suite-wide UX/scope audit.

## 0.2.1 — Fix invisible brand-color borders/backgrounds + data-layer tests (2026-09-02)

- **fix**: `brand-200`/`brand-800`/`brand-900` were referenced in 11 places
  across 5 components (toolbar button borders, the WIP-limit explainer
  card, column tags, the active-nav header pill) but never defined in
  `tailwind.config.js` — Tailwind silently emits no class for an
  undefined shade, so these rendered as invisible borders/backgrounds/text
  in both light and dark mode. A previous run had flagged 2 of the 11 as
  a known gap (`border-brand-200` on two toolbar buttons); a suite-wide
  audit found the other 9. Completed the `brand` scale with Tailwind's
  own `orange` values — the 6 existing shades were already drawn
  verbatim from that palette, so 200/800/900 slot in exactly.
- **test**: added `vitest` + `jsdom` (this repo's first automated test
  coverage). `src/data/templates.test.ts` covers the 10 built-in
  templates' data-shape invariants (unique ids, non-empty columns) and
  the custom-template CRUD functions (`createCustomTemplate`,
  `deleteCustomTemplate`, `cloneTemplate`, `cloneCustomTemplate`,
  including corrupted-storage recovery). `npm test` now passes cleanly:
  1 file, 11 tests.

## 0.2.0 — E3: Export board as CSV (2026-09-02)

- **feat**: "Export CSV" toolbar button (next to Export Image) downloads a
  spreadsheet-ready card list — one row per card, columns for Column, Swim
  Lane, Title, Description, Colour, Due Date, and a computed Overdue flag.
  Recurses into `column.subColumns` (the original spec predated that
  field) and includes cards from collapsed columns, since a data export
  shouldn't silently drop rows a spreadsheet user would expect to see.
  i18n: `designer.export_csv` in EN/ES/BE/RU.
- **docs**: refresh `GOAL.md` from the suite-wide `GOALS.md` platform
  thesis and rebuild `ROADMAP.md` around it.
- **chore**: closed 22 stale GitHub issues (#2–#42) that were already
  shipped or approved-but-unimplemented, confirmed against source (and,
  for cross-app integrations, spot-checked directly) before closing — no
  functional change, repo housekeeping only.
- Docs-only pass: added `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, filled in `README.md` with dev commands, `localStorage` keys, and tech notes, and added this changelog. No behavior change — these documents extract and formalize intent/state that previously only lived in `.artefacts/BRIEF.md`.
- docs: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
