# Changelog

All notable changes to Kanban Designer are documented here.

## Unreleased

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
