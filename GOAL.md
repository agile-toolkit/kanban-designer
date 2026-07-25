# Kanban Designer — Goal

## Problem
Agile coaches and team leads need a fast, no-setup way to design and visualize Kanban board layouts — column structures, WIP limits, swim lanes, and card-level detail — so they can explore board archetypes, teach Kanban concepts, and hand off a structured board to other tools in the suite, without committing to a heavyweight project-tracking backend.

## Audience
Agile coaches, Scrum Masters, and team leads who are sketching or teaching Kanban board designs during a workshop or planning session, and who want to share the result (via link, image, or JSON) or feed it into Sprint Metrics, Planning Poker, or Team Identity elsewhere in the Agile Tools suite.

## Success criteria
1. A user can build a board — columns, WIP limits, swim lanes — from scratch or from a template gallery of Kanban archetypes with educational context.
2. A user can add, edit, colour, tag, assign, date, and checklist cards to model real work on the board.
3. Board state round-trips via JSON export/import, exports as a PNG snapshot, and can be shared as a URL — all client-side, no server or login.
4. The board integrates with the rest of the suite: writes localStorage state for the Dashboard and Planning Poker, and deep-links into Sprint Metrics.
5. The UI works fully in EN/ES/BE/RU, supports light/dark theme, and is keyboard-navigable with ARIA roles.

## Non-goals
- Not a full project-management or issue-tracking system — no persistence backend, no multi-user real-time sync, no accounts.
- Not a time-tracking or deep-analytics tool — the built-in stats panel is a summary only; detailed flow analytics belong to Sprint Metrics.
- No server-side storage — all state lives in the browser (localStorage / URL fragment) or in exported files the user manages themselves.
