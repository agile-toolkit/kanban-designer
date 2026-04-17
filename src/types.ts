export interface Column {
  id: string;
  name: string;
  wipLimit: number | null;
  color: string;
}

export interface SwimLane {
  id: string;
  name: string;
  color: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  columnId: string;
  laneId: string | null;
  size: 'S' | 'M' | 'L';
}

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  useCase: string;
  strengths: string[];
  risks: string[];
  columns: Omit<Column, 'id'>[];
}

export interface BoardConfig {
  id: string;
  name: string;
  columns: Column[];
  lanes: SwimLane[];
  cards: KanbanCard[];
  createdAt: string;
  updatedAt: string;
}

export type View = 'home' | 'board';
