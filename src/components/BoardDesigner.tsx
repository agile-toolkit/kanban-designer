import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import type { KanbanBoard } from '../types'
import ColumnCard from './ColumnCard'

interface Props {
  board: KanbanBoard
  onUpdate: (board: KanbanBoard) => void
}

export default function BoardDesigner({ board, onUpdate }: Props) {
  const { t } = useTranslation()
  const [newLane, setNewLane] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const patch = (partial: Partial<KanbanBoard>) => onUpdate({ ...board, ...partial })

  const addColumn = () => {
    patch({
      columns: [
        ...board.columns,
        { id: crypto.randomUUID(), name: `Column ${board.columns.length + 1}`, wipLimit: null, cards: [] },
      ],
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = board.columns.findIndex(c => c.id === active.id)
    const newIdx = board.columns.findIndex(c => c.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1) {
      patch({ columns: arrayMove(board.columns, oldIdx, newIdx) })
    }
  }

  const updateColumn = (id: string, updates: Partial<typeof board.columns[0]>) => {
    patch({ columns: board.columns.map(c => c.id === id ? { ...c, ...updates } : c) })
  }

  const deleteColumn = (id: string) => {
    patch({ columns: board.columns.filter(c => c.id !== id) })
  }

  const addCard = (colId: string, title: string) => {
    patch({
      columns: board.columns.map(c =>
        c.id === colId
          ? { ...c, cards: [...c.cards, { id: crypto.randomUUID(), title }] }
          : c
      ),
    })
  }

  const deleteCard = (colId: string, cardId: string) => {
    patch({
      columns: board.columns.map(c =>
        c.id === colId ? { ...c, cards: c.cards.filter(k => k.id !== cardId) } : c
      ),
    })
  }

  const totalCards = board.columns.reduce((s, c) => s + c.cards.length, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
        <button onClick={addColumn} className="btn-primary text-sm py-1.5">
          + {t('designer.add_column')}
        </button>

        {board.swimLanes.length < 5 && (
          <div className="flex gap-1">
            <input
              className="input w-32 text-xs py-1.5"
              placeholder={t('designer.add_lane')}
              value={newLane}
              onChange={e => setNewLane(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newLane.trim()) {
                  patch({ swimLanes: [...board.swimLanes, newLane.trim()] })
                  setNewLane('')
                }
              }}
            />
            <button
              onClick={() => { if (newLane.trim()) { patch({ swimLanes: [...board.swimLanes, newLane.trim()] }); setNewLane('') } }}
              className="btn-secondary text-xs py-1"
            >
              + {t('designer.add_lane')}
            </button>
          </div>
        )}

        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={board.showWipWarnings}
            onChange={e => patch({ showWipWarnings: e.target.checked })}
            className="accent-brand-600"
          />
          {t('designer.show_wip_warnings')}
        </label>

        <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
          <span>{board.columns.length} {t('designer.total_columns')}</span>
          <span>{totalCards} {t('designer.total_cards')}</span>
        </div>
      </div>

      {/* Swim lanes header */}
      {board.swimLanes.length > 0 && (
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-1.5 flex gap-2 items-center">
          {board.swimLanes.map(lane => (
            <div key={lane} className="flex items-center gap-1">
              <span className="text-xs bg-white border border-gray-200 rounded px-2 py-0.5 text-gray-600">{lane}</span>
              <button onClick={() => patch({ swimLanes: board.swimLanes.filter(l => l !== lane) })} title={t('designer.delete_lane')} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Board canvas */}
      <div className="flex-1 overflow-x-auto p-4">
        {board.columns.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            {t('designer.no_columns')}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-3 min-w-max">
                {board.columns.map(col => (
                  <ColumnCard
                    key={col.id}
                    column={col}
                    showWipWarnings={board.showWipWarnings}
                    onRename={name => updateColumn(col.id, { name })}
                    onWipChange={wipLimit => updateColumn(col.id, { wipLimit })}
                    onDelete={() => deleteColumn(col.id)}
                    onAddCard={title => addCard(col.id, title)}
                    onDeleteCard={cardId => deleteCard(col.id, cardId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
