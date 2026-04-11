# BRIEF — Kanban Designer

## What this app does
An interactive Kanban board designer and configurator. Users can design a Kanban system from scratch — define columns (workflow stages), set WIP limits, add swim lanes, and visualize flow. The app shows different board archetypes (from the source material's 10 board examples) as starting templates and explains the rationale behind each design choice.

## Target users
Team leads, Agile coaches, and project managers setting up or improving a Kanban system for software or knowledge-work teams.

## Core features (MVP)
- Visual board builder: drag-and-drop columns, rename, reorder, delete
- WIP limit configuration per column with visual violation warnings
- Swim lane support (by team, by urgency, by work type)
- 10 pre-built board templates from the source material
- "Why this design?" educational callouts for each template
- Export board config as JSON or PNG snapshot

## Educational layer
- Each board template has a context card: when to use it, its strengths and risks
- WIP limit explainer: Little's Law, flow efficiency, queue theory basics
- Kanban principles panel referencing Scrum & Kanban book

## Tech stack
React 18 + TypeScript + Vite + Tailwind CSS + @dnd-kit for drag-and-drop. No backend for MVP. GitHub Pages deployment.

## Source materials in `.artefacts/`
- `10 different kanban boards and their context - RU.pdf` — 10 board archetypes with context
- `ScrumAndKanbanRuFinal.pdf` — Scrum & Kanban theory
- `BacklogManager-v8.xls` — backlog/flow data reference

## i18n
English + Russian (react-i18next).

## Agentic pipeline roles
- `/vadavik` — spec & requirements validation
- `/lojma` — UX/UI design (board canvas, column cards, WIP badges)
- `/laznik` — architecture (state model for board config, drag-and-drop)
- `@cmok` — implementation
- `@bahnik` — QA (drag-and-drop edge cases, WIP overflow states)
- `@piarun` — documentation
- `@zlydni` — git commits & GitHub Pages deploy
