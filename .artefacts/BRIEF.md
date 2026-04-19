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

## Tech notes

- Literal-key scans false-positive on `` t(`templates.context.${key}`) `` — do not delete those keys blindly.

## Agent Log

### 2026-04-19 — feat: wire orphan designer.* i18n keys

- Done: Wired `designer.rename` as tooltip on column name span; `designer.delete_column`, `delete_card`, `delete_lane` as `title` on ✕ buttons; `designer.no_limit` as WIP limit input placeholder; `designer.column_name_placeholder` in rename input. Removed duplicate `cards_count` from en.json and ru.json.
- All BRIEF features now implemented.
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration; flagged orphan `designer.*` keys.
- Next task: For each orphan `designer.*` in `en.json`, add UI in `BoardDesigner.tsx` / `ColumnCard.tsx` or remove from `en.json` and `ru.json`.
