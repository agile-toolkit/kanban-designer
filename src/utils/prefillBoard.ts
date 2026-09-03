import type { KanbanBoard } from '../types'

/**
 * Improvement Board (and any future sender following the same convention)
 * hands off a full board as JSON in a one-shot `?prefill=` query param, e.g.
 * `buildKanbanUrl()` in improvement-board/src/utils/kanbanLink.ts. Parsed
 * once on load; the caller is responsible for stripping the param
 * afterwards so a page refresh doesn't re-import.
 */
export function parsePrefillBoard(search: string): KanbanBoard | null {
  const raw = new URLSearchParams(search).get('prefill')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<KanbanBoard>
    if (!parsed || !Array.isArray(parsed.columns)) return null
    return {
      id: parsed.id ?? crypto.randomUUID(),
      name: parsed.name ?? 'Imported board',
      columns: parsed.columns,
      swimLanes: parsed.swimLanes ?? [],
      showWipWarnings: parsed.showWipWarnings ?? false,
    }
  } catch {
    return null
  }
}
