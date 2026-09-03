export interface KanbanColumn {
  id: string
  name: string
  wipLimit: number | null
  cards: KanbanCard[]
  subColumns?: KanbanColumn[]
  collapsed?: boolean
}

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface KanbanCard {
  id: string
  title: string
  description?: string
  swimLane?: string
  color?: string
  dueDate?: string
  tags?: string[]
  assignee?: string
  enteredColumnAt?: string
  checklist?: ChecklistItem[]
}

export type BoardMode = 'design' | 'track'

export interface KanbanBoard {
  id: string
  name: string
  columns: KanbanColumn[]
  swimLanes: string[]
  showWipWarnings: boolean
  /**
   * 'design' (default, including when absent — older boards predate this
   * field): structure only. 'track' reveals due dates, assignees,
   * checklists, card aging, and the stats panel — see GOAL.md's boundary
   * ("not a board execution tool") for why these are opt-in, not default.
   */
  mode?: BoardMode
  /** Last save time for “My boards” list */
  updatedAt?: number
}

export type Screen = 'home' | 'designer' | 'templates' | 'learn'

export interface CustomTemplate {
  id: string
  name: string
  createdAt: string
  board: KanbanBoard
}
