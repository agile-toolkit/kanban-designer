# Kanban Designer — Brief

## Overview

Interactive Kanban designer: columns, WIP limits, swim lanes, template gallery with context labels. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Board editor — columns, cards, WIP warnings, import/export JSON (`BoardDesigner.tsx`, `App.tsx`)
- [x] Template gallery — `templates.context.*` via `` t(`templates.context.${contextKey}`) ``
- [x] EN + RU
- [ ] Designer strings — `designer.no_limit`, `rename`, `delete_column`, `delete_card`, `delete_lane`, `column_name_placeholder`, `cards_count` appear unused (no literal `t('…')` in `src/`); wire UI or delete from locales

## Backlog

<!-- Research / UX issues -->

## Tech notes

- Literal-key scans false-positive on `` t(`templates.context.${key}`) `` — do not delete those keys blindly.

## Agent Log

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration; flagged orphan `designer.*` keys.
- Next task: For each orphan `designer.*` in `en.json`, add UI in `BoardDesigner.tsx` / `ColumnCard.tsx` or remove from `en.json` and `ru.json`.
