# Changelog

All notable changes to Kanban Designer are documented here.

## Unreleased

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
