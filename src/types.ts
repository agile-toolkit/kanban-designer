export interface KanbanColumn {
  id: string
  name: string
  wipLimit: number | null
  cards: KanbanCard[]
  subColumns?: KanbanColumn[]
}

export interface KanbanCard {
  id: string
  title: string
  swimLane?: string
}

export interface KanbanBoard {
  id: string
  name: string
  columns: KanbanColumn[]
  swimLanes: string[]
  showWipWarnings: boolean
  /** Last save time for “My boards” list */
  updatedAt?: number
}

export type Screen = 'home' | 'designer' | 'templates' | 'learn'
