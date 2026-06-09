# Kanban Designer — Brief

## Overview

Interactive Kanban designer: columns, WIP limits, swim lanes, template gallery with context labels. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Board editor — columns, cards, WIP warnings, import/export JSON (`BoardDesigner.tsx`, `App.tsx`)
- [x] Template gallery — `templates.context.*` via `` t(`templates.context.${contextKey}`) ``
- [x] EN + ES + BE + RU — all four locales with full key coverage; `<select>` language switcher in nav
- [x] Designer strings wired — `designer.rename` (tooltip on column name), `delete_column`/`delete_card`/`delete_lane` (button titles), `no_limit` (WIP input placeholder), `column_name_placeholder` (rename input); duplicate `cards_count` removed
- [x] Card drag-and-drop — cards sortable within and between columns via `@dnd-kit` multi-container sortable; `CardItem` component with `useSortable`; vertical `SortableContext` per column; `DragOverlay` ghost; column reorder preserved
- [x] Sprint Metrics deep-link — "Send to Sprint Metrics" toolbar button encodes board column data as base64 JSON and opens `https://agile-toolkit.github.io/sprint-metrics/?kanban=<base64>` in a new tab; i18n key `designer.send_to_sprint_metrics` in all 4 locales
- [x] Board image export (#4) — "Export Image" toolbar button captures board canvas with `html2canvas` (scale 2×) and downloads `<board-name>-kanban.png`; i18n key `designer.export_image` in all 4 locales
- [x] Card colour labels (#5) — `color?: string` on `KanbanCard` (stem: red/orange/yellow/green/blue/purple); 4px top border stripe on cards; inline card-edit mode (double-click title) shows title input + 6-swatch colour picker + clear button; `designer.card_color` / `designer.no_color` i18n keys in all 4 locales; colour visible in `DragOverlay` ghost
- [x] Shareable board URL (#7) — board state base64-encoded in `window.location.hash` (`#board=<base64>`) on every update via `history.replaceState`; on load, URL board is decoded and added to the boards list (opens in designer); "Copy link" toolbar button with `navigator.clipboard.writeText`, 2-second "Link copied!" toast; `designer.copy_link` / `designer.link_copied` i18n keys in all 4 locales
- [x] Dashboard localStorage key (#10) — `kanban-designer:lastSession` written by `writeLastSession()` inside `updateBoard()` on every board save; shape: `{ boardName, columnCount, cardCount, boardCount, updatedAt }`
- [x] Swim lane rows (#11) — CSS grid layout when `swimLanes.length > 0`: `ColumnHeaderStrip` renders column headers at top; `LaneCell` renders filtered cards per lane row (null = "None" row for unassigned cards); lane pill badge on each card in `CardItem` (click cycles through available lanes); `addCard` accepts optional `swimLane` arg; `CardUpdates` includes `swimLane`; `designer.swim_lane_none` / `designer.swim_lane_assign` i18n keys in all 4 locales; column DnD disabled in swim lane mode
- [x] WIP limit progress bar (#14) — `WipBar` component in `ColumnCard.tsx`; 4px bar rendered below WIP limit input in both `ColumnCard` and `ColumnHeaderStrip`; colour: green (0–59%), amber (60–89%), orange (90–99%), red+animate-pulse (≥100%); hidden when `wipLimit` is null; tooltip via `designer.wip_utilisation_tooltip` (`{{count}} of {{limit}} cards ({{pct}}%)`) in all 4 locales
- [x] Planning Poker integration (#15) — `kanban-designer:currentBoard` written by `writeCurrentBoard()` inside `updateBoard()` with shape `{ boardName, columns:[{name, cards:[{title, description}]}], updatedAt }`; `description?: string` added to `KanbanCard` type; "Send to Planning Poker" button in `BoardDesigner` toolbar deep-links to `?kanban-board=<base64-board-name>`; `designer.send_to_planning_poker` i18n key in all 4 locales

## localStorage keys

| Key | Written by | Shape |
|-----|-----------|-------|
| `kanban-designer:lastSession` | `App.tsx updateBoard()` via `writeLastSession()` | `{ boardName: string, columnCount: number, cardCount: number, boardCount: number, updatedAt: string }` |
| `kanban-designer:currentBoard` | `App.tsx updateBoard()` via `writeCurrentBoard()` | `{ boardName: string, columns: [{name: string, cards: [{title: string, description: string}]}], updatedAt: string }` |

## Backlog

<!-- Research / UX issues -->
- [x] [#31] Feature: undo/redo support — Ctrl+Z/Ctrl+Y board history (50-entry in-memory stack; toolbar buttons; no new deps)
- [ ] [#32] Feature: card due dates — deadline badge + overdue highlighting (`dueDate?: string` on KanbanCard; date input in inline edit; badge with gray/amber/red states)
- [ ] [#33] Feature: column collapse — fold/unfold columns to reduce visual noise (`collapsed?: boolean` on KanbanColumn; chevron toggle; narrow strip with card count)
- [x] [#2] Feature: add ES and BE locales (parity with suite) — implemented
- [x] [#3] Feature: card drag-and-drop between columns — implemented
- [x] [#4] Integration: export board snapshot as shareable image — implemented
- [x] [#5] Feature: card colour labels for priority and type tagging — implemented
- [x] [#6] Integration: Sprint Metrics — export per-column flow data — implemented
- [x] [#7] Feature: shareable board URL (encode state in URL fragment) — implemented
- [x] [#10] Integration: write kanban-designer:lastSession for Dashboard card — implemented
- [x] [#11] Feature: swim lane rows — horizontal board striping with row assignment per card
- [x] [#12] Feature: keyboard accessibility — Tab/arrow navigation + ARIA roles
- [x] Card search and filter (#13) — text search input + colour dot-filters + swim lane select in a filter row below the toolbar; `displayColumns` computed from `matchesFilter`; filters apply across both normal and swim-lane layouts; clear-all button when any filter active; `designer.search_placeholder` / `designer.filter_color` / `designer.filter_lane` / `designer.clear_filters` i18n keys in all 4 locales
- [x] [#14] WIP limit progress bar (#14) — 4px colour-coded bar below WIP limit input in `ColumnCard` and `ColumnHeaderStrip`; green (0–59%), amber (60–89%), orange (90–99%), red+pulse (≥100%); hidden when no WIP limit; hover tooltip via `designer.wip_utilisation_tooltip` i18n key in all 4 locales
- [x] [#15] Integration: Planning Poker — write `kanban-designer:currentBoard` + "Send to Planning Poker" deep-link button
- [x] [#16] Unify header: AppHeader component + LanguagePicker
- [x] Light/dark theme (#17) — `tailwind.config.js` `darkMode: ['selector','[data-theme="dark"]']`; anti-flash `<script>` in `index.html`; `ThemeToggle.tsx` in `src/components/`; `<ThemeToggle />` in `AppHeader` children slot; `dark:` variants on all surfaces, borders, text, and inputs across `App.tsx`, `AppHeader.tsx`, `BoardDesigner.tsx`, `ColumnCard.tsx`, `HomeScreen.tsx`, `TemplatesView.tsx`, `LearnView.tsx`, `index.css`

## Tech notes

- Literal-key scans false-positive on `` t(`templates.context.${key}`) `` — do not delete those keys blindly.

## Agent Log

### 2026-06-09 — feat: undo/redo support (#31)
- Done: `boardHistory: KanbanBoard[]` + `boardFuture: KanbanBoard[]` state in `App.tsx`; `applyBoard()` helper (bypasses history); `updateBoard()` now pushes current board to history (cap 50), clears future before applying change; `undo()` / `redo()` via functional state updaters; `undoRef`/`redoRef` pattern avoids stale closure in global keyboard handler; Ctrl+Z/Meta+Z = undo, Ctrl+Y/Ctrl+Shift+Z = redo; history cleared when `currentId` changes (board switch); Undo/Redo buttons in AppHeader toolbar (disabled at stack boundaries); `designer.undo`/`designer.redo` i18n keys in EN/ES/BE/RU
- Remaining: #32 (card due dates), #33 (column collapse)
- Next task: check issues for human feedback; if #32 (card due dates) or #33 (column collapse) approved, implement #32 first

### 2026-06-07 — research: undo/redo, card due dates, column collapse
- Done: reviewed all open issues — #2–#17 all approved and implemented (In Review); no pending human feedback
- Done: created issue #31 (undo/redo — 50-entry history stack, Ctrl+Z/Y, toolbar buttons)
- Done: created issue #32 (card due dates — dueDate field, date badge, overdue red highlight)
- Done: created issue #33 (column collapse — collapsed boolean, chevron toggle, narrow strip with count)
- All three added to project with Backlog status
- Remaining: none immediately actionable; awaiting human review on #31–#33
- Next task: check issues for human feedback; if any of #31/#32/#33 approved, implement first one

### 2026-06-02 — feat: light/dark theme (#17)
- Done: `<ThemeToggle />` added to `App.tsx` in AppHeader children slot (import added)
- Done: `dark:` variants applied to all Tailwind color classes in `App.tsx`, `AppHeader.tsx`, `BoardDesigner.tsx`, `ColumnCard.tsx`, `HomeScreen.tsx`, `TemplatesView.tsx`, `LearnView.tsx`
- Done: `index.css` component layer updated — `.card`, `.btn-secondary`, `.btn-ghost`, `.label`, `.input` all have dark variants; `body` gets `dark:bg-gray-950 dark:text-gray-50`
- Done: `tailwind.config.js` already had `darkMode: ['selector','[data-theme="dark"]']`; `index.html` already had anti-flash script; `ThemeToggle.tsx` already in `src/components/` — no changes needed to those files
- Issue #17 fully implemented; project status → In Review
- Remaining backlog: none (all known features done)
- Next task: check issues for human feedback

### 2026-06-02 — feat: unify header — AppHeader + LanguagePicker (#16)
- Done: copied `AppHeader.tsx` and `LanguagePicker.tsx` from `design-system/components/` into `src/components/`
- Done: replaced inline `<header>` in `App.tsx` with `<AppHeader title onTitleClick navItems>` — 3 nav items: Boards/Templates/Learn
- Done: board action buttons (Export JSON, Import JSON, Copy link, Clear) moved into AppHeader children slot, shown only when `screen === 'designer' && board`
- Done: removed native `<select>` language switcher; `i18n` no longer destructured in `App.tsx`
- Done: added `nav.boards` key to EN/ES/BE/RU locale files
- Issue #16 fully implemented; project status → In Review
- Remaining backlog: #17 (light/dark theme)
- Next task: check issues for human feedback; implement #17 (light/dark theme — tailwind darkMode: "class", ThemeToggle already in src/components/, add dark: variants)

### 2026-06-02 — feat: Planning Poker integration (#15)
- Done: `CURRENT_BOARD_KEY = 'kanban-designer:currentBoard'` constant; `writeCurrentBoard(board)` helper writes `{boardName, columns:[{name, cards:[{title, description}]}], updatedAt}` to localStorage; called from `updateBoard()` alongside `writeLastSession()`
- Done: `description?: string` added to `KanbanCard` type in `types.ts` for future card-level descriptions
- Done: "Send to Planning Poker" button in `BoardDesigner` toolbar (next to Sprint Metrics); deep-links to `https://agile-toolkit.github.io/planning-poker/?kanban-board=<base64-board-name>`; `designer.send_to_planning_poker` i18n key added to EN/ES/BE/RU
- Issue #15 fully implemented; project status → In Review
- Remaining backlog: #16 (AppHeader), #17 (dark theme)
- Next task: check issues for human feedback; implement #16 (Unify header — AppHeader component + LanguagePicker from design-system)

### 2026-06-01 — feat: WIP limit progress bar (#14)
- Done: `WipBar` component added to `ColumnCard.tsx` — 4px colour-coded bar (green/amber/orange/red+pulse) based on `cardCount / wipLimit` ratio; hidden when no WIP limit set
- Done: bar rendered below WIP limit input in both `ColumnCard` (default export) and `ColumnHeaderStrip` (swim-lane mode)
- Done: `designer.wip_utilisation_tooltip` key added to EN/ES/BE/RU; displayed as `title` on the bar container
- Issue #14 fully implemented; project status → In Review
- Remaining backlog: #15 (Planning Poker import), #16 (AppHeader), #17 (dark theme)
- Next task: check issues for human feedback; implement #15 (Planning Poker integration — write `kanban-designer:currentBoard` key from `updateBoard()` with shape `{boardName, columns:[{name,cards:[{title,description}]}],updatedAt}`; add "Send to Planning Poker" button in `BoardDesigner` toolbar that deep-links to planning-poker with `?kanban-board=<base64-board-name>`)

### 2026-06-01 — feat: card search and filter (#13)
- Done: `filterText` / `filterColor` / `filterLane` state in `BoardDesigner`; `matchesFilter(card)` function; `displayColumns` = board.columns with filtered cards when any filter active
- Done: filter row (row 2 of toolbar) — text search input, 6 colour dot-buttons (toggle), swim lane `<select>` (only when swim lanes exist), clear-all button
- Done: `displayColumns` passed to all renderers (`ColumnCard`, `ColumnHeaderStrip`, `LaneCell`) in both normal and swim-lane layouts; mutations still reference original `board.columns` via handlers
- Done: `designer.search_placeholder` / `designer.filter_color` / `designer.filter_lane` / `designer.clear_filters` keys added to EN/ES/BE/RU
- Issue #13 fully implemented; project status → In Review
- Remaining backlog: #14 (WIP progress bar), #15 (Planning Poker import), #16 (AppHeader), #17 (dark theme)
- Next task: check issues for human feedback; implement #14 (WIP limit progress bar — colour-coded gauge per column: green/amber/orange/red based on utilisation ratio; shown below WIP limit input in ColumnCard and ColumnHeaderStrip)

### 2026-06-01 — feat: keyboard accessibility (#12)
- Done: `tabIndex={0}` + `role="listitem"` + `aria-label={card.title}` on `CardItem` (both editing and non-editing states); focus ring via `focus:ring-2 focus:ring-brand-400`
- Done: `handleKeyDown` on cards — Enter/F2 → open inline edit; Delete/Backspace (first press) → show `delete_card_confirm` toast with red border (2-second auto-reset), second press → delete; ArrowUp/ArrowDown → focus prev/next `[role="listitem"]` in parent list; Escape → cancel confirm
- Done: `role="list"` + `aria-label={column.name}` on card container divs in `ColumnCard` and `LaneCell`
- Done: `role="region"` + `aria-label={board.name}` on board canvas div in `BoardDesigner`
- Done: visually-hidden skip-to-board `<a href="#board-canvas">` link at top of `BoardDesigner`; shown on focus
- Done: `designer.delete_card_confirm` + `designer.skip_to_board` i18n keys in EN/ES/BE/RU
- Issue #12 fully implemented; project status → In Review
- Remaining backlog: #13 (card search/filter), #14 (WIP progress bar), #15 (Planning Poker import), #16 (AppHeader), #17 (dark theme)
- Next task: check issues for human feedback; implement #13 (card search and filter — text search + colour/swim lane filter pills in BoardDesigner toolbar; filters applied over board state before rendering)

### 2026-05-31 — research: check issues → transition to keyboard a11y (#12)
- Done: reviewed all open issues; #12–#17 all approved; #16 and #17 added to backlog
- Done: issue #12 (keyboard accessibility) set to In Progress in project board
- Remaining backlog: #12 (keyboard a11y), #13 (card search/filter), #14 (WIP progress bar), #15 (Planning Poker import), #16 (AppHeader), #17 (dark theme)
- Next task: implement #12 (keyboard accessibility: tabIndex=0 on CardItem + role=listitem+aria-label; role=region/aria-label on board container; role=list+aria-label on column card lists; Enter/F2 → open inline edit; Delete/Backspace → delete card with toast; ArrowUp/ArrowDown → focus prev/next card; skip-to-board link; designer.delete_card_confirm i18n key in all 4 locales)

### 2026-05-31 — feat: swim lane rows (#11)
- Done: `ColumnCard.tsx` — exported `ColumnHeaderStrip` (column header without drag handle, used in grid top row) and `LaneCell` (filtered card area per lane+column cell, with Add card and lane pill); `CardItem` gains `availableLanes`/`swimLanePillNone`/`swimLaneAssign` props and shows a clickable lane pill below the title; `CardUpdates` type exported and extended with `swimLane`; `ColumnCard` default export unchanged for no-lane mode
- Done: `BoardDesigner.tsx` — `hasSwimlanes` branch renders `DndContext` with column headers row + lane rows (`[...board.swimLanes, null]`); `addCard` accepts optional `swimLane` arg; `updateCard` passes through `swimLane`; normal layout unchanged
- Done: `designer.swim_lane_none` / `designer.swim_lane_assign` keys added to EN/ES/BE/RU
- Issue #11 fully implemented; project status → In Review
- Remaining backlog: #12 (keyboard a11y), #13 (card search/filter), #14 (WIP progress bar), #15 (Planning Poker import)
- Next task: check issues for human feedback

### 2026-05-30 — feat: Dashboard localStorage key (#10)
- Done: added `LAST_SESSION_KEY = 'kanban-designer:lastSession'` constant; added `writeLastSession(activeBoard, allBoards)` helper that serialises `{ boardName, columnCount, cardCount, boardCount, updatedAt }` to localStorage; called from `updateBoard()` on every board save
- Issue #10 fully implemented; project status → In Review
- Remaining backlog: #11 (swim lane rows), #12 (keyboard a11y), #13 (card search/filter), #14 (WIP progress bar), #15 (Planning Poker import), #16 (AppHeader unification), #17 (light/dark theme)
- Next task: implement #11 (swim lane rows — horizontal board striping: CSS grid when swimLanes.length > 0, filter cards by swimLane in ColumnCard, pill badge on cards, designer.swim_lane_none / designer.swim_lane_assign i18n keys)

### 2026-05-28 — feat: shareable board URL (#7)
- Done: module-level `parseBoardFromHash()` decodes `#board=<base64>` on page load; if valid board found, added to boards list and opened in designer; `encodeBoard()` uses `btoa(encodeURIComponent(JSON.stringify(board)))`; `useEffect` on `board` writes `history.replaceState` on every board change; "Copy link" toolbar button calls `navigator.clipboard.writeText(window.location.href)` with 2-second green "Link copied!" toast; `designer.copy_link` / `designer.link_copied` keys in EN/ES/BE/RU
- Issue #7 fully implemented; project status → In Review
- Remaining backlog: #10 (localStorage lastSession for Dashboard), #11 (swim lane rows), #12 (keyboard a11y), #13 (card search/filter), #14 (WIP progress bar), #15 (Planning Poker import)
- Next task: check issues for human feedback; implement #10 (write kanban-designer:lastSession key in App.tsx updateBoard: { boardName, columnCount, cardCount, boardCount, updatedAt })

### 2026-05-25 — feat: card colour labels (#5)
- Done: added `color?: string` to `KanbanCard` in `types.ts`; 6-colour palette (red/orange/yellow/green/blue/purple) with hex map; 4px top border stripe on `CardItem`; double-click card title opens inline edit with title input + colour swatches + clear button; `onUpdateCard` prop chain `CardItem → ColumnCard → BoardDesigner`; `DragOverlay` ghost now shows colour stripe; `designer.card_color` / `designer.no_color` i18n keys added to EN/ES/BE/RU
- Issue #5 fully implemented; project status → In Review
- Remaining approved: #7, #10, #11, #12, #13, #14, #15, #16, #17
- Next task: implement #7 (shareable board URL: base64-encode board state to `window.location.hash` on every `onUpdate` call, hydrate from hash on load, "Copy link" toolbar button with `navigator.clipboard.writeText`, `designer.copy_link` / `designer.link_copied` i18n keys)

### 2026-05-22 — feat: board image export (#4)
- Done: installed html2canvas; added `exportImage()` in `BoardDesigner.tsx` with 2× scale PNG download; "Export Image" button in toolbar (disabled during capture); `boardCanvasRef` on board canvas div; `designer.export_image` key in EN/ES/BE/RU
- Issue #4 fully implemented; project status → In Review
- Remaining approved: #5, #7, #10, #11, #12, #13, #14, #15, #16, #17
- Next task: implement #5 (card colour labels: add `color?: string` to Card type, 4px top border stripe on cards, colour swatch picker in card edit modal, i18n keys `designer.card_color` and `designer.no_color`)

### 2026-05-16 — research: card search/filter + WIP progress bar + Planning Poker integration
- Done: checked all open issues — #4, #5, #7, #10, #11, #12 still needs-review (no human feedback); #2, #3, #6 approved and already fully implemented (In Review)
- Done: created issue #13 (card search + filter — text search + colour/swim lane filter pills in BoardDesigner toolbar)
- Done: created issue #14 (WIP limit progress bar — colour-coded gauge per column: green/amber/orange/red)
- Done: created issue #15 (Planning Poker import — write kanban-designer:currentBoard to localStorage, 'Send to Planning Poker' deep-link + SetupView reader on Planning Poker side)
- All three issues added to project with Backlog status
- Next task: check issues for human feedback; implement first approved item among #4, #5, #7, #10, #11, #12, #13, #14, #15

### 2026-05-14 — research: Dashboard key + swim lane rows + keyboard accessibility
- Done: checked all open issues — #2, #3, #6 already In Review; #4, #5, #7 still needs-review (no changes)
- Done: created issue #10 (write kanban-designer:lastSession for Dashboard card — App.tsx single-file change)
- Done: created issue #11 (swim lane rows — swimLanes already in types.ts but UI only shows tag bar, not row grid)
- Done: created issue #12 (keyboard accessibility — Tab/arrow nav, ARIA roles, card keyboard handlers)
- All three issues added to project with Backlog status
- Next task: check issues for human feedback; implement first approved item among #4 (html2canvas export), #5 (card colour labels), #7 (shareable URL), #10 (localStorage session key), #11 (swim lane rows), #12 (keyboard a11y)

### 2026-05-10 — feat: card drag-and-drop + Sprint Metrics deep-link (#3, #6)
- Done: extracted `CardItem` with `useSortable` in `ColumnCard.tsx`; added vertical `SortableContext` per column; updated `BoardDesigner.tsx` with `onDragStart`/`onDragEnd` for multi-container (column reorder + cross-column card move + intra-column card sort); added `DragOverlay` ghost; switched collision detection to `closestCorners`
- Done: "Send to Sprint Metrics" button in toolbar — serialises column stats to JSON, base64-encodes, opens Sprint Metrics in new tab; `designer.send_to_sprint_metrics` key added to all 4 locales
- Issues #3 and #6 fully implemented; project status → In Review
- Remaining approved: none currently; all open issues are `needs-review`
- Next task: check issues for human feedback (#4 board image export, #5 card colour labels, #7 shareable URL)

### 2026-05-03 — feat: ES + BE locales (#2)
- Done: created `src/i18n/es.json` and `src/i18n/be.json` with full key coverage; registered both in `src/i18n/index.ts`; replaced EN↔RU toggle button with `<select>` cycling all four languages (EN/ES/BE/RU) in App.tsx nav
- Issue #2 fully implemented; project status → In Review
- Remaining approved: #3 (card drag-and-drop), #6 (Sprint Metrics integration)
- Next task: implement #3 (card drag-and-drop between columns using @dnd-kit multi-container sortable)

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
