import { describe, it, expect } from 'vitest'
import { wrapBoardExport, unwrapBoardExport, BOARD_SCHEMA, BOARD_SCHEMA_VERSION } from './boardExport'
import type { KanbanBoard } from '../types'

const board: KanbanBoard = {
  id: 'b1',
  name: 'Test board',
  columns: [{ id: 'c1', name: 'To do', wipLimit: null, cards: [] }],
  swimLanes: [],
  showWipWarnings: false,
}

describe('wrapBoardExport / unwrapBoardExport', () => {
  it('wraps a board in the versioned envelope', () => {
    const wrapped = wrapBoardExport(board)
    expect(wrapped).toEqual({ schema: BOARD_SCHEMA, version: BOARD_SCHEMA_VERSION, board })
  })

  it('round-trips a board through wrap then unwrap', () => {
    expect(unwrapBoardExport(wrapBoardExport(board))).toEqual(board)
  })

  it('unwraps a bare board object (pre-schema producers, e.g. Improvement Board)', () => {
    expect(unwrapBoardExport(board)).toEqual(board)
  })

  it('returns null for non board-shaped input', () => {
    expect(unwrapBoardExport(null)).toBeNull()
    expect(unwrapBoardExport('not an object')).toBeNull()
    expect(unwrapBoardExport({ foo: 'bar' })).toBeNull()
    expect(unwrapBoardExport({ schema: BOARD_SCHEMA })).toBeNull()
  })
})
