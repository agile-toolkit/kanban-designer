import { describe, it, expect } from 'vitest'
import { parsePrefillBoard } from './prefillBoard'

function encodeBoard(board: unknown): string {
  return `prefill=${encodeURIComponent(JSON.stringify(board))}`
}

describe('parsePrefillBoard', () => {
  it('returns null when prefill is absent', () => {
    expect(parsePrefillBoard('')).toBeNull()
    expect(parsePrefillBoard('?utm_source=improvement-board')).toBeNull()
  })

  it('returns null on malformed JSON instead of throwing', () => {
    expect(parsePrefillBoard('?prefill=not-json')).toBeNull()
  })

  it('returns null when the payload has no columns array', () => {
    expect(parsePrefillBoard(`?${encodeBoard({ id: '1', name: 'x' })}`)).toBeNull()
  })

  it('parses an Improvement Board style export (matches buildKanbanUrl shape)', () => {
    const board = {
      id: 'ib-1',
      name: 'Improvement Board',
      columns: [
        { id: 'identified', name: 'Identified', wipLimit: null, cards: [{ id: 'c1', title: 'Fix flaky test' }], subColumns: [] },
        { id: 'in_progress', name: 'In Progress', wipLimit: null, cards: [], subColumns: [] },
        { id: 'done', name: 'Done', wipLimit: null, cards: [], subColumns: [] },
      ],
      swimLanes: [],
      showWipWarnings: false,
    }
    const result = parsePrefillBoard(`?${encodeBoard(board)}&utm_source=improvement-board`)
    expect(result).toEqual(board)
  })

  it('fills in sensible defaults for a minimal payload', () => {
    const result = parsePrefillBoard(`?${encodeBoard({ columns: [] })}`)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('Imported board')
    expect(result!.swimLanes).toEqual([])
    expect(result!.showWipWarnings).toBe(false)
    expect(typeof result!.id).toBe('string')
    expect(result!.id.length).toBeGreaterThan(0)
  })
})
