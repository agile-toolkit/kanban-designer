# Kanban Designer — Brief

## Overview

Interactive Kanban designer: columns, WIP limits, swim lanes, template gallery with context labels. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Board editor — columns, cards, WIP warnings, import/export JSON (`BoardDesigner.tsx`, `App.tsx`)
- [x] Template gallery — `templates.context.*` via `` t(`templates.context.${contextKey}`) ``
- [x] EN + RU
- [x] Designer strings wired — `designer.rename` (tooltip on column name), `delete_column`/`delete_card`/`delete_lane` (button titles), `no_limit` (WIP input placeholder), `column_name_placeholder` (rename input); duplicate `cards_count` removed

## Backlog

<!-- Research / UX issues -->
- [ ] [#2] Feature: add ES and BE locales (parity with suite)
- [ ] [#3] Feature: card drag-and-drop between columns
- [ ] [#4] Integration: export board snapshot as shareable image
- [ ] [#5] Feature: card colour labels for priority and type tagging
- [ ] [#6] Integration: Sprint Metrics — export per-column flow data
- [ ] [#7] Feature: shareable board URL (encode state in URL fragment)

## Tech notes

- Literal-key scans false-positive on `` t(`templates.context.${key}`) `` — do not delete those keys blindly.

## Agent Log

### 2026-04-27 — research: market + integration + UX opportunities (round 2)
- Done: created issues #5 (card colour labels), #6 (Sprint Metrics flow data integration), #7 (shareable board URL)
- Existing issues #2 #3 #4 still awaiting human review — no feedback yet
- Next task: check needs-review issues for human feedback (#2 ES+BE locales, #3 card drag-and-drop, #4 board image export, #5 card colour labels, #6 Sprint Metrics integration, #7 shareable URL)

### 2026-04-25 — research: market + UX + integration opportunities

- Done: created issues #2 (ES+BE locales), #3 (card drag-and-drop between columns), #4 (export board snapshot as image)
- Waiting for human review on all three
- Next task: check needs-review issues for human feedback (#2 ES+BE locales, #3 card drag-and-drop, #4 board image export)

### 2026-04-19 — feat: wire orphan designer.* i18n keys

- Done: Wired `designer.rename` as tooltip on column name span; `designer.delete_column`, `delete_card`, `delete_lane` as `title` on ✕ buttons; `designer.no_limit` as WIP limit input placeholder; `designer.column_name_placeholder` in rename input. Removed duplicate `cards_count` from en.json and ru.json.
- All BRIEF features now implemented.
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration; flagged orphan `designer.*` keys.
- Next task: For each orphan `designer.*` in `en.json`, add UI in `BoardDesigner.tsx` / `ColumnCard.tsx` or remove from `en.json` and `ru.json`.
