# Kanban Designer

An interactive Kanban board designer and configurator — define columns, set WIP limits, add swim lanes, and explore 10 board archetypes with educational context. Structure only, always: no due dates, assignees, checklists, card aging, or a stats panel — see `GOAL.md`'s "not a board execution tool" boundary. Teams who want to run real work on a board designed here use [Kanban Tracker](https://github.com/agile-toolkit/kanban-tracker), a separate execution app that imports boards designed here (or any domain-specific tracker that reads the same board format). Boards are editable client-side only: no backend, no accounts — state lives in `localStorage` and the URL.

Part of the [Agile Tools](https://github.com/bthos) suite built on ICAgile and Lean/Kanban source materials.

See `GOAL.md` for why this app exists and `ROADMAP.md` for what's shipped and what's next.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · @dnd-kit · react-i18next (EN/ES/BE/RU)

## Dev commands
```bash
npm install     # install dependencies
npm run dev     # start Vite dev server
npm run build   # tsc typecheck + production build
npm run preview # preview the production build locally
npm test        # vitest run — src/data/templates.ts
```

## Deploy
GitHub Pages via GitHub Actions on push to `main`.

## localStorage keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `kanban-designer-boards` | `KanbanBoard[]` | All boards the user has created, persisted locally. |
| `kanban-designer-current-id` | `string` | Id of the board currently open in the designer. |
| `kanban-designer-board` | `KanbanBoard` (legacy) | Pre-multi-board single-board save; migrated into `kanban-designer-boards` on load, then removed. |
| `kanban-designer:lastSession` | `{ boardName, columnCount, cardCount, boardCount, updatedAt }` | Summary written on every save, read by the suite Dashboard's "last session" card. |
| `kanban-designer:currentBoard` | `{ boardName, columns: [{ name, cards: [{ title, description }] }], updatedAt }` | Written on every save; read by Planning Poker's "Send to Planning Poker" deep-link import. |
| `kanban-designer:customTemplates` | `{ templates: [{ id, name, createdAt, board }] }` | User-saved board structures (columns/WIP/lanes only, no card content) shown in the Templates gallery. |
| `theme` | `"light" \| "dark"` | Shared, suite-wide theme preference (unprefixed key by convention — read/written the same way by sibling apps under the same origin). |
| `kanban-designer:facilitatorMode` (`sessionStorage`) | `'1' \| '0'` | Facilitator (projector) mode toggle — per-tab, not persisted across sessions. See `src/components/useFacilitatorMode.ts`. |

## Tech notes

- **State management** — plain React state (`useState`/`useMemo`/`useRef`) in `App.tsx` and `BoardDesigner.tsx`; no external store. `App.tsx` owns the board list and undo/redo history (`boardHistory`/`boardFuture`, capped at 50 entries, Ctrl+Z/Ctrl+Y).
- **i18n** — `react-i18next` with `i18next-browser-languagedetector`; four locale JSON files under `src/i18n/` (`en`, `es`, `be`, `ru`) with full key parity. A literal-key scan (`` t(\`templates.context.${key}\`) ``) is used for template context strings — grep-based dead-key checks will false-positive on it.
- **Theme** — `tailwind.config.js` `darkMode: ['selector', '[data-theme="dark"]']`; an anti-flash inline `<script>` in `index.html` applies the stored theme before first paint; `ThemeToggle.tsx` flips `data-theme` on `<html>` and persists to the shared `theme` key.
- **Shareable URL** — board state is base64-encoded into `window.location.hash` (`#board=<base64>`) via `history.replaceState` on every change; a board opened from a shared link is decoded on load and added to the local boards list.
- **Cross-app integrations (same-origin `localStorage`)** — writes `kanban-designer:lastSession` and `kanban-designer:currentBoard` for the Dashboard and Planning Poker respectively; "Send to Sprint Metrics" deep-links with board data base64-encoded in the query string rather than localStorage; Kanban Tracker reads `kanban-designer-boards` directly to offer a "From Kanban Designer" import picker. Also *receives* a board via a one-shot `?prefill=<JSON>` query param (Improvement Board's "Open in Kanban Designer" link), consumed as a fallback to the app's own `#board=` hash-link format — see `src/utils/prefillBoard.ts`.
- **Canonical board export/import schema** (`src/utils/boardExport.ts`) — every full-fidelity board transport (JSON file export/import, `#board=` share link) wraps/unwraps a `{ schema: 'agile-toolkit.kanban-board', version: 1, board }` envelope, so any suite app can produce or consume a board without a bespoke shape per integration. Full spec: `BOARD_SCHEMA.md` in the `agile-toolkit/.github` meta-repo. Import paths (`#board=`, `?prefill=`, file import) also accept a bare `KanbanBoard` object with no envelope, since every producer that exists today (Improvement Board's `?prefill=` sender) predates the schema — `unwrapBoardExport()` is the fallback logic, and is the reference other apps should copy rather than reimplement. This is the foundation for Kanban Tracker (a separate execution app) and any domain-specific tracker (Change Planner, Scrum Facilitator's retro board) to seed from a board designed here. `KanbanCard` still declares `dueDate`/`assignee`/`checklist`/`enteredColumnAt` as optional pass-through fields (not editable or shown here) purely so a board round-tripped through Tracker and back doesn't lose that data.
- **Drag-and-drop** — `@dnd-kit` multi-container sortable (`closestCorners` collision detection); one vertical `SortableContext` per column, plus a `DragOverlay` ghost that mirrors card colour/lane.
- **Card description** — a multi-line note per card, edited via a `<textarea>` in the card's inline edit mode (`ColumnCard.tsx`); shows as a 1-line truncated preview on the card face and is included in the card search filter, CSV export, and JSON export/import.
- **CSV export** (`exportCsv` in `BoardDesigner.tsx`) — one row per card (Column, Swim Lane, Title, Description, Colour), Blob-download, no new dependency. Recurses into `column.subColumns` (labeling nested columns `"Parent > Child"`) since the original spec's example predated that field. Cards in collapsed columns are still included, since a data export shouldn't silently drop rows a spreadsheet user would expect to see.
- **`brand` color scale** (`tailwind.config.js`) — Tailwind's stock `orange` palette. Only keep shades that are actually referenced in `className`s (currently 50/100/200/400/500/600/700/800/900) — an unreferenced shade silently renders as no class at all (invisible border/background/text, not an error), which is what happened to `brand-200`/`800`/`900` before a suite-wide audit caught it.

## Source materials
See `.artefacts/BRIEF.md` for the full run-by-run implementation history and source file references.
