# BRIEF

Derived per [`agent-state.NO-BRIEF.md`](https://github.com/agile-toolkit/.github/blob/main/agent-state.NO-BRIEF.md). There was **no prior** `BRIEF.md`. Sources: `README.md`, `src/i18n/en.json` / `ru.json`, `src/`. Generated **2026-04-19**.

## Product scope (from `README.md`)

- **Kanban board designer:** columns, WIP limits, swim lanes, **10 archetypes** with educational context.
- Stack: React 18, TypeScript, Vite, Tailwind, `@dnd-kit`, react-i18next (EN/RU).
- Deploy: GitHub Pages via Actions on `main`.

## Build

- `npm run build` — **passes** (verified **2026-04-19**).

## TODO / FIXME in `src/`

- None.

## i18n — dynamic keys

- `templates.context.*` used via `` t(`templates.context.${tpl.contextKey}`) `` in `HomeScreen.tsx`, `TemplatesView.tsx`.

## i18n — likely orphaned keys (verify)

No literal `t('designer.no_limit')` / `rename` / `delete_column` / `delete_card` / `delete_lane` / `column_name_placeholder` / `cards_count` found under `src/` — keys may be **unused** or reserved for a future toolbar. Confirm in `src/i18n/en.json` and either wire in `BoardDesigner.tsx` / `ColumnCard.tsx` or remove.

## Classification (NO-BRIEF)

- **Status:** `in-progress` until designer.* orphan keys are resolved or documented as intentional.
- **First next task:** For each unused `designer.*` string in `en.json`, either add UI (column rename/delete, card delete, “no limit” label) in `src/components/BoardDesigner.tsx` / `ColumnCard.tsx` or delete the key from `en.json` and `ru.json`.
