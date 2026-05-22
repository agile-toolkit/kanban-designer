import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent, type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import html2canvas from 'html2canvas'
import type { KanbanBoard, KanbanCard } from '../types'
import ColumnCard from './ColumnCard'

interface Props {
  board: KanbanBoard
  onUpdate: (board: KanbanBoard) => void
}

export default function BoardDesigner({ board, onUpdate }: Props) {
  const { t } = useTranslation()
  const [newLane, setNewLane] = useState('')
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  const [exporting, setExporting] = useState(false)
  const boardCanvasRef = useRef<HTMLDivElement>(null)

  const exportImage = async () => {
    if (!boardCanvasRef.current || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(boardCanvasRef.current, {
        backgroundColor: '#f9fafb',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `${board.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-kanban.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setExporting(false)
    }
  }

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    for (const col of board.columns) {
      const card = col.cards.find(c => c.id === active.id)
      if (card) { setActiveCard(card); return }
    }
    setActiveCard(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over || active.id === over.id) return

    // Column drag — active is a column
    const activeColIdx = board.columns.findIndex(c => c.id === active.id)
    if (activeColIdx !== -1) {
      const overColIdx = board.columns.findIndex(c => c.id === over.id)
      if (overColIdx !== -1) {
        patch({ columns: arrayMove(board.columns, activeColIdx, overColIdx) })
      }
      return
    }

    // Card drag — find source column and card index
    let srcColId: string | null = null
    let srcCardIdx = -1
    for (const col of board.columns) {
      const idx = col.cards.findIndex(c => c.id === active.id)
      if (idx !== -1) { srcColId = col.id; srcCardIdx = idx; break }
    }
    if (!srcColId) return

    // Find destination: over can be a column or a card
    let dstColId: string | null = null
    let dstCardIdx = -1
    const overAsCol = board.columns.find(c => c.id === over.id)
    if (overAsCol) {
      // Dropped on a column header/area — append to end
      dstColId = overAsCol.id
      dstCardIdx = overAsCol.cards.length
    } else {
      // Dropped on a card — insert at that card's position
      for (const col of board.columns) {
        const idx = col.cards.findIndex(c => c.id === over.id)
        if (idx !== -1) { dstColId = col.id; dstCardIdx = idx; break }
      }
    }
    if (!dstColId) return

    if (srcColId === dstColId) {
      // Reorder within same column
      const col = board.columns.find(c => c.id === srcColId)!
      patch({ columns: board.columns.map(c => c.id === srcColId ? { ...c, cards: arrayMove(col.cards, srcCardIdx, dstCardIdx) } : c) })
    } else {
      // Move card to different column
      const srcCard = board.columns.find(c => c.id === srcColId)!.cards[srcCardIdx]
      patch({
        columns: board.columns.map(col => {
          if (col.id === srcColId) return { ...col, cards: col.cards.filter(c => c.id !== srcCard.id) }
          if (col.id === dstColId) {
            const newCards = [...col.cards]
            newCards.splice(dstCardIdx < 0 ? newCards.length : dstCardIdx, 0, srcCard)
            return { ...col, cards: newCards }
          }
          return col
        }),
      })
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
          <button
            onClick={exportImage}
            disabled={exporting}
            className="text-xs text-gray-600 hover:text-gray-800 font-medium border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {exporting ? '…' : t('designer.export_image')}
          </button>
          <button
            onClick={() => {
              const payload = {
                boardName: board.name,
                exportedAt: new Date().toISOString(),
                columns: board.columns.map(c => ({ name: c.name, cardCount: c.cards.length, wipLimit: c.wipLimit })),
              }
              const encoded = btoa(JSON.stringify(payload))
              window.open(`https://agile-toolkit.github.io/sprint-metrics/?kanban=${encoded}`, '_blank', 'noopener')
            }}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium border border-brand-200 rounded px-2 py-1 hover:bg-brand-50 transition-colors"
          >
            {t('designer.send_to_sprint_metrics')}
          </button>
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
      <div ref={boardCanvasRef} className="flex-1 overflow-x-auto p-4">
        {board.columns.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            {t('designer.no_columns')}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
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
            <DragOverlay>
              {activeCard ? (
                <div className="bg-white rounded-lg border border-brand-300 px-2.5 py-2 text-xs shadow-lg w-52 opacity-95 cursor-grabbing">
                  <span className="text-gray-700 leading-snug select-none">{activeCard.title}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}
