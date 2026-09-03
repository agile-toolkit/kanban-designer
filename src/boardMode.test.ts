import { describe, it, expect } from 'vitest'
import { resolveBoardMode } from './boardMode'
import type { KanbanBoard } from './types'

function makeBoard(overrides: Partial<KanbanBoard> = {}): KanbanBoard {
  return {
    id: 'b1',
    name: 'Board',
    columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [] }],
    swimLanes: [],
    showWipWarnings: false,
    ...overrides,
  }
}

describe('resolveBoardMode', () => {
  it('leaves an explicit mode untouched', () => {
    const board = makeBoard({ mode: 'design' })
    expect(resolveBoardMode(board).mode).toBe('design')
  })

  it('defaults a board with no track data to design', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card' }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('design')
  })

  it('infers track when a card has a due date', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card', dueDate: '2026-01-01' }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('track')
  })

  it('infers track when a card has an assignee', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card', assignee: 'Alice' }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('track')
  })

  it('infers track when a card has a non-empty checklist', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card', checklist: [{ id: 'i1', text: 'Step 1', done: false }] }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('track')
  })

  it('does not infer track from enteredColumnAt alone (stamped unconditionally on every card)', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card', enteredColumnAt: '2026-01-01T00:00:00.000Z' }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('design')
  })

  it('checks nested subColumns for track data', () => {
    const board = makeBoard({
      columns: [{
        id: 'c1', name: 'To Do', wipLimit: null, cards: [],
        subColumns: [{ id: 'sc1', name: 'Nested', wipLimit: null, cards: [{ id: 'card1', title: 'A card', assignee: 'Bob' }] }],
      }],
    })
    expect(resolveBoardMode(board).mode).toBe('track')
  })

  it('an empty checklist array does not count as track data', () => {
    const board = makeBoard({
      columns: [{ id: 'c1', name: 'To Do', wipLimit: null, cards: [{ id: 'card1', title: 'A card', checklist: [] }] }],
    })
    expect(resolveBoardMode(board).mode).toBe('design')
  })
})
