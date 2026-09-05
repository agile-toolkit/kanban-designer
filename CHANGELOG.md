# Changelog

All notable changes to Kanban Designer are documented here.

## Unreleased

## 0.5.3 — Include assignee in the cross-app board snapshot (2026-09-05)

- **fix**: `writeCurrentBoard()` (the `kanban-designer:currentBoard`
  localStorage snapshot other suite apps read) was dropping each card's
  `assignee` field — it only ever serialized `title`/`description`, even
  though `KanbanCard.assignee` has existed on the data model since #38.
  Work Profiles issue #55 (per-profile active-card count) needs this
  field to match cards to people; it now round-trips through the
  snapshot when set.

## 0.5.2 — Keyboard shortcuts help overlay (2026-09-05)

- **added**: a centered modal (`ShortcutsModal.tsx`) listing all keyboard
  shortcuts, grouped into Navigation, Card actions, Board actions, and a
  Mouse & touch section (double-click to edit, drag to move/reorder) so
  it isn't keyboard-only. Every shortcut listed was already implemented
  (`ColumnCard.tsx`'s Arrow/Enter/F2/Delete/Backspace/Escape handling,
  `App.tsx`'s Ctrl+Z/Ctrl+Y) — this ships the missing documentation
  surface, not new behaviour.
- **added**: opens via a `?` toolbar button (next to the theme/facilitator
  toggles, `QuestionIcon`) or the `?` key; the key is ignored while an
  `<input>`/`<textarea>` has focus so typing a literal `?` in the card
  search box doesn't pop the modal. Closes on Escape, a backdrop click,
  or the header close button.
- **context**: closes [Issue #44](https://github.com/agile-toolkit/kanban-designer/issues/44).
  Chose a centered modal over a Figma-style side panel since the app has
  no persistent side-panel chrome to anchor one to.

## 0.5.1 — Card description field (2026-09-05)

- **added**: cards now support a multi-line description, editable via a
  `<textarea>` in the card's inline edit mode (`ColumnCard.tsx`). A
  1-line truncated preview shows on the card face when a description is
  set.
- **added**: the card search box now also matches against description
  text, not just the title (`BoardDesigner.tsx`).
- **context**: closes [Issue #43](https://github.com/agile-toolkit/kanban-designer/issues/43),
  the first of the two epics left in `ROADMAP.md` after the Track-mode
  removal. `KanbanCard.description` already existed as an optional field
  on the type and round-tripped through JSON export/import — this ships
  the UI to actually read and write it.

## 0.5.0 — Remove Track mode entirely (2026-09-05)

- **removed**: the Design/Track mode toggle, `KanbanBoard.mode` and
  `resolveBoardMode()` (`src/boardMode.ts`, deleted), due-date/assignee/
  checklist/card-aging display and editing on cards (`ColumnCard.tsx`),
  the assignee filter and `team-identity-charter` lookup
  (`BoardDesigner.tsx`), the Stats panel (`StatsPanel.tsx`, deleted), and
  the Due Date/Overdue CSV export columns.
- **context**: reverses the 0.3.0 Design/Track split. Kanban Tracker now
  fully covers the same capability (card CRUD, a stats panel, and
  drag-and-drop) against boards imported from here via the canonical
  export schema, so a second, partial copy of execution features here no
  longer serves a purpose and re-opens the exact "does it design or does
  it track?" confusion the split was meant to fix. `KanbanCard`'s
  `dueDate`/`assignee`/`checklist`/`enteredColumnAt` fields stay in
  `types.ts` as optional, never-edited pass-through so a board
  round-tripped through Tracker and back for a redesign doesn't lose that
  data — Designer just never shows or touches it.

## 0.4.3 — Canonical board export/import schema (2026-09-04)

- **feat**: full-fidelity board transports (JSON file export/import, the
  `#board=` share link) now wrap/unwrap a versioned
  `{ schema: 'agile-toolkit.kanban-board', version: 1, board }` envelope
  (`src/utils/boardExport.ts`), documented as `BOARD_SCHEMA.md` in the
  `agile-toolkit/.github` meta-repo. This is the format the suite's other
  apps should target to seed from a board designed here — starting with the
  new, separate `kanban-tracker` app for lightweight execution, and
  eventually domain-specific trackers (Change Planner, Scrum Facilitator's
  retro board) that map board columns/cards onto their own model. Backward
  compatible: every import path (`#board=`, `?prefill=`, file import) still
  accepts a bare `KanbanBoard` object, so Improvement Board's existing
  `?prefill=` sender (`kanbanLink.ts`) needed no change.
- **context**: resolves the "does Kanban Designer need to split?" question —
  it doesn't. Track mode stays here; the new capability other apps need is a
  stable interchange format, not a smaller Kanban Designer.

## 0.4.2 — Add glass effect to the header (2026-09-04)

- **fix**: `AppHeader.tsx`'s background changed from opaque
  `bg-white`/`dark:bg-gray-900` to `bg-[var(--glass)] backdrop-blur-sm` —
  the Dashboard's own nav has always had this translucent blur effect,
  but the shared header every app copies did not. User-reported
  inconsistency. This app's header already carried a local
  `dark:bg-brand-900/30` active-pill variation from the canonical
  source — left untouched, only the background line changed. Verified
  in both themes.

- **feat**: synced the shared `icons.tsx` (48 → 64 icons) and replaced the
  remaining decorative emoji: the designer's empty-state hero (`🗂`) and the
  home screen's hero (`📋`) both become `KanbanIcon` at hero size, muted
  (`text-slate-300`/`dark:text-gray-600`) so they read as art, not controls;
  the Learn view's WIP and flow section icons (`🚦`/`🌊`) become
  `TrafficLightIcon`/`FlowIcon` — the `icon` field on those two topic entries
  is now a component reference instead of a raw emoji string. The
  checklist-progress badge's embedded `✓` — left as plain text in 0.3.2
  because it was baked into the translated string — is now a `CheckIcon`
  rendered next to the count in `ColumnCard`, with the glyph stripped from
  all four locale strings (`en`/`es`/`be`/`ru`); the `{{done}}/{{total}}`
  interpolation is unchanged. `HandshakeIcon` was dropped from the shared set
  upstream (superseded by `TeamIcon`); nothing in this app imported it.
- **ci**: CI Node bumped 20 → 22 and `engines` declared. `jsdom@30` requires
  Node `^22.22.2 || ^24.15.0 || >=26`, so the test step could never have passed
  on the pinned Node 20 — invisible until this release started running the
  tests in CI at all. Builds were unaffected (vite and tsc do not load jsdom).


## 0.4.0 — Error boundary and test-gated deploys (2026-09-03)

- **feat**: `ErrorBoundary` at the root of the app. Every app in the suite reads
  payloads written by *other* apps, historically through `JSON.parse(raw) as T`
  with no runtime check; an unexpected shape threw during render, unmounted the
  tree and left a blank page that a reload could not fix, because the offending
  data was still in localStorage. The fallback offers "clear this app's saved
  data", scoped to this app's own key prefixes so recovery cannot destroy a
  neighbouring app's data on the shared origin.
- **ci**: `npm test` now runs before `npm run build` in `deploy.yml`. The suite
  had 301 passing tests and CI ran them in exactly one repo of eleven.

## 0.3.3 — Facilitator Mode persists across suite apps (2026-09-03)

- **fix**: `useFacilitatorMode`'s storage key changed from
  `'kanban-designer:facilitatorMode'` to the shared
  `'agile-toolkit:facilitatorMode'` — user-requested so Facilitator Mode
  survives navigating to another suite app in the same tab instead of
  resetting. sessionStorage is already shared per-origin-per-tab; this
  was previously app-prefixed specifically to keep it isolated, which
  turned out to be the wrong default for a cross-app presentation
  session.

## 0.3.2 — Replace decorative ✕/✓ emoji with SVG icons (2026-09-03)

- **feat**: replaced all 15 decorative `✕`/`✓` text-glyph buttons (column
  delete, card delete, checklist-item remove, tag remove, due-date clear,
  color clear, swim-lane delete, template delete, save-edit confirm, stats
  panel close, template-rename cancel, filter clear) with `CloseIcon`/
  `CheckIcon` from the new shared `icons.tsx`. They render via
  `currentColor`, so each button keeps exactly the color it already had
  (delete buttons stay red-on-hover, etc.) — purely a glyph swap, no
  behavior change. First app in a suite-wide emoji→SVG sweep the user
  asked for; the checklist-progress i18n string's embedded "✓" character
  was left as-is (plain translated text, not a UI icon).

## 0.3.1 — Facilitator Mode (2026-09-03)

- **feat**: added Facilitator (projector) Mode — a presentation toggle for
  in-room board reviews, bigger UI via one CSS rule (everything sized in
  `rem` scales automatically) plus hiding the nav pills and language
  picker while active. Toggled from a new header button next to the theme
  toggle, session-scoped via `sessionStorage`. Adopted from the shared
  design-system pattern (`useFacilitatorMode.ts` + `FacilitatorToggle.tsx`),
  originally built for Team Identity. The designer toolbar (undo/redo,
  export/import, copy link, clear) stays visible — those are primary
  editing actions, not secondary chrome.

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
