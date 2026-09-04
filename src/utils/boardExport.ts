import type { KanbanBoard } from '../types'

/**
 * Canonical cross-app board interchange format — full spec documented in
 * `BOARD_SCHEMA.md` in the `agile-toolkit/.github` meta-repo. Any suite app
 * that wants to seed from a board designed here (the standalone Track app,
 * or a domain-specific tracker like Improvement Board/Change Planner) reads
 * this envelope rather than negotiating a bespoke shape per consumer.
 */
export const BOARD_SCHEMA = 'agile-toolkit.kanban-board'
export const BOARD_SCHEMA_VERSION = 1

export interface BoardExportEnvelope {
  schema: typeof BOARD_SCHEMA
  version: typeof BOARD_SCHEMA_VERSION
  board: KanbanBoard
}

export function wrapBoardExport(board: KanbanBoard): BoardExportEnvelope {
  return { schema: BOARD_SCHEMA, version: BOARD_SCHEMA_VERSION, board }
}

/**
 * Accepts the versioned envelope, or a bare board object — every producer
 * that predates this schema (Improvement Board's `?prefill=` sender, a
 * hand-rolled JSON file, an older export from this app) sends the latter,
 * and none of those senders are updated by this change. Returns null for
 * anything that isn't recognizably board-shaped.
 */
export function unwrapBoardExport(data: unknown): KanbanBoard | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (obj.schema === BOARD_SCHEMA && obj.board && typeof obj.board === 'object') {
    return obj.board as KanbanBoard
  }
  if (Array.isArray((obj as Partial<KanbanBoard>).columns)) {
    return obj as unknown as KanbanBoard
  }
  return null
}
