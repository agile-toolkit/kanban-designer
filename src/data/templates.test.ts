import { describe, it, expect, beforeEach } from 'vitest'
import {
  TEMPLATES,
  cloneTemplate,
  loadCustomTemplates,
  createCustomTemplate,
  deleteCustomTemplate,
  cloneCustomTemplate,
} from './templates'
import type { KanbanBoard } from '../types'

beforeEach(() => localStorage.clear())

describe('TEMPLATES', () => {
  it('has a unique id for every template', () => {
    const ids = TEMPLATES.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique column ids within each template, and at least one column', () => {
    for (const t of TEMPLATES) {
      expect(t.columns.length).toBeGreaterThan(0)
      const colIds = t.columns.map(c => c.id)
      expect(new Set(colIds).size).toBe(colIds.length)
    }
  })

  it('starts every template with empty column cards', () => {
    for (const t of TEMPLATES) {
      for (const col of t.columns) {
        expect(col.cards).toEqual([])
      }
    }
  })
})

describe('cloneTemplate', () => {
  it('gives the board and every column a fresh id, distinct from the template', () => {
    const template = TEMPLATES[0]!
    const board = cloneTemplate(template)
    expect(board.id).not.toBe(template.id)
    board.columns.forEach((c, i) => expect(c.id).not.toBe(template.columns[i]!.id))
  })

  it('preserves column count, names, and swim lanes', () => {
    const template = TEMPLATES.find(t => t.id === 'support')!
    const board = cloneTemplate(template)
    expect(board.columns.map(c => c.name)).toEqual(template.columns.map(c => c.name))
    expect(board.swimLanes).toEqual(template.swimLanes)
  })

  it('does not mutate the template when the clone is changed', () => {
    const template = TEMPLATES[0]!
    const board = cloneTemplate(template)
    board.swimLanes.push('New Lane')
    expect(template.swimLanes).not.toContain('New Lane')
  })
})

describe('custom templates', () => {
  const sampleBoard: KanbanBoard = {
    id: 'b1',
    name: 'My Board',
    columns: [{ id: 'c1', name: 'Todo', wipLimit: null, cards: [{ id: 'card1' } as never] }],
    swimLanes: ['Lane A'],
    showWipWarnings: true,
  }

  it('starts empty', () => {
    expect(loadCustomTemplates()).toEqual([])
  })

  it('creates, persists, and strips cards from a custom template', () => {
    const template = createCustomTemplate(sampleBoard, 'Saved Board')
    expect(template.name).toBe('Saved Board')
    expect(template.board.columns[0]!.cards).toEqual([])

    const loaded = loadCustomTemplates()
    expect(loaded).toHaveLength(1)
    expect(loaded[0]!.id).toBe(template.id)
  })

  it('deletes a custom template by id', () => {
    const t1 = createCustomTemplate(sampleBoard, 'One')
    createCustomTemplate(sampleBoard, 'Two')
    const remaining = deleteCustomTemplate(t1.id)
    expect(remaining.map(t => t.name)).toEqual(['Two'])
    expect(loadCustomTemplates().map(t => t.name)).toEqual(['Two'])
  })

  it('cloneCustomTemplate gives fresh ids and empty cards', () => {
    const template = createCustomTemplate(sampleBoard, 'Saved Board')
    const board = cloneCustomTemplate(template)
    expect(board.id).not.toBe(template.board.id)
    expect(board.columns[0]!.id).not.toBe(template.board.columns[0]!.id)
    expect(board.columns[0]!.cards).toEqual([])
  })

  it('loadCustomTemplates recovers gracefully from corrupted storage', () => {
    localStorage.setItem('kanban-designer:customTemplates', '{not json')
    expect(loadCustomTemplates()).toEqual([])
  })
})
