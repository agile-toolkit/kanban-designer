import type { KanbanBoard, KanbanColumn } from './types'

function boardHasTrackData(columns: KanbanColumn[]): boolean {
  return columns.some(col =>
    col.cards.some(c => Boolean(c.dueDate || c.assignee || (c.checklist && c.checklist.length > 0)))
    || (col.subColumns ? boardHasTrackData(col.subColumns) : false)
  )
}

/**
 * Boards saved before Track mode existed have no `mode` field. Defaulting
 * those blindly to 'design' would silently hide due dates/assignee/checklist
 * data a user is actively relying on — so infer 'track' instead when any of
 * that data is already present. New boards always get an explicit `mode` at
 * creation time (see data/templates.ts, HomeScreen.tsx) and are unaffected.
 * `enteredColumnAt` is deliberately excluded: it's stamped on every card
 * unconditionally, so checking it would make nearly every board with cards
 * infer 'track'.
 */
export function resolveBoardMode(board: KanbanBoard): KanbanBoard {
  if (board.mode) return board
  return { ...board, mode: boardHasTrackData(board.columns) ? 'track' : 'design' }
}
