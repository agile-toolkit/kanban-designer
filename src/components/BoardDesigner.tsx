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
import ColumnCard, { ColumnHeaderStrip, LaneCell, type CardUpdates } from './ColumnCard'

interface Props {
  board: KanbanBoard
  onUpdate: (board: KanbanBoard) => void
}

const CARD_COLORS = [
  { stem: 'red',    hex: '#f87171' },
  { stem: 'orange', hex: '#fb923c' },
  { stem: 'yellow', hex: '#facc15' },
  { stem: 'green',  hex: '#4ade80' },
  { stem: 'blue',   hex: '#60a5fa' },
  { stem: 'purple', hex: '#a78bfa' },
]

function loadTeamMembers(): string[] {
  try {
    const raw = localStorage.getItem('team-identity-charter')
    if (!raw) return []
    const charter = JSON.parse(raw)
    return Array.isArray(charter?.members) ? charter.members.filter(Boolean) : []
  } catch {
    return []
  }
}

export default function BoardDesigner({ board, onUpdate }: Props) {
  const { t } = useTranslation()
  const [newLane, setNewLane] = useState('')
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  const [exporting, setExporting] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterLane, setFilterLane] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('')
  const [teamMembers] = useState<string[]>(loadTeamMembers)
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

    // Column drag — active is a column (no-op in swim lane mode since no SortableContext for columns)
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
      dstColId = overAsCol.id
      dstCardIdx = overAsCol.cards.length
    } else {
      for (const col of board.columns) {
        const idx = col.cards.findIndex(c => c.id === over.id)
        if (idx !== -1) { dstColId = col.id; dstCardIdx = idx; break }
      }
    }
    if (!dstColId) return

    if (srcColId === dstColId) {
      const col = board.columns.find(c => c.id === srcColId)!
      patch({ columns: board.columns.map(c => c.id === srcColId ? { ...c, cards: arrayMove(col.cards, srcCardIdx, dstCardIdx) } : c) })
    } else {
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

  const addCard = (colId: string, title: string, swimLane?: string) => {
    patch({
      columns: board.columns.map(c =>
        c.id === colId
          ? { ...c, cards: [...c.cards, { id: crypto.randomUUID(), title, swimLane }] }
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

  const updateCard = (colId: string, cardId: string, updates: CardUpdates) => {
    patch({
      columns: board.columns.map(c =>
        c.id === colId
          ? { ...c, cards: c.cards.map(k => k.id === cardId ? { ...k, ...updates } : k) }
          : c
      ),
    })
  }

  const isFiltered = Boolean(filterText || filterColor || filterLane || filterTag || filterAssignee)

  const matchesFilter = (card: KanbanCard): boolean => {
    if (filterText && !card.title.toLowerCase().includes(filterText.toLowerCase())) return false
    if (filterColor && card.color !== filterColor) return false
    if (filterLane) {
      if (filterLane === '__none__') { if (card.swimLane) return false }
      else { if (card.swimLane !== filterLane) return false }
    }
    if (filterTag && !(card.tags ?? []).includes(filterTag)) return false
    if (filterAssignee) {
      if (filterAssignee === '__unassigned__') { if (card.assignee) return false }
      else { if (card.assignee !== filterAssignee) return false }
    }
    return true
  }

  const displayColumns = isFiltered
    ? board.columns.map(col => ({ ...col, cards: col.cards.filter(matchesFilter) }))
    : board.columns

  const clearFilters = () => { setFilterText(''); setFilterColor(''); setFilterLane(''); setFilterTag(''); setFilterAssignee('') }

  const boardTags = [...new Set(board.columns.flatMap(col => col.cards.flatMap(c => c.tags ?? [])))]

  const totalCards = board.columns.reduce((s, c) => s + c.cards.length, 0)
  const hasSwimlanes = board.swimLanes.length > 0
  const allLanes: (string | null)[] = [...board.swimLanes, null]

  const dragOverlay = activeCard ? (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-brand-300 dark:border-brand-700 overflow-hidden text-xs shadow-lg w-52 opacity-95 cursor-grabbing">
      {activeCard.color && (() => {
        const COLORS: Record<string, string> = { red: '#f87171', orange: '#fb923c', yellow: '#facc15', green: '#4ade80', blue: '#60a5fa', purple: '#a78bfa' }
        return <div style={{ height: 4, backgroundColor: COLORS[activeCard.color] }} />
      })()}
      <div className="px-2.5 py-2">
        <span className="text-gray-700 dark:text-gray-200 leading-snug select-none">{activeCard.title}</span>
      </div>
    </div>
  ) : null

  return (
    <div className="flex flex-col h-full">
      <a
        href="#board-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-white dark:focus:bg-gray-800 focus:border focus:border-brand-400 focus:rounded focus:px-3 focus:py-1 focus:text-sm focus:text-brand-600 dark:focus:text-brand-400 focus:shadow"
      >
        {t('designer.skip_to_board')}
      </a>
      {/* Toolbar — row 1: actions */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2 flex-wrap">
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

        <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={board.showWipWarnings}
            onChange={e => patch({ showWipWarnings: e.target.checked })}
            className="accent-brand-600"
          />
          {t('designer.show_wip_warnings')}
        </label>

        <div className="ml-auto flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <button
            onClick={exportImage}
            disabled={exporting}
            className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium border border-gray-200 dark:border-gray-700 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
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
          <button
            onClick={() => {
              const encoded = btoa(unescape(encodeURIComponent(board.name)))
              window.open(`https://agile-toolkit.github.io/planning-poker/?kanban-board=${encoded}`, '_blank', 'noopener')
            }}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium border border-brand-200 rounded px-2 py-1 hover:bg-brand-50 transition-colors"
          >
            {t('designer.send_to_planning_poker')}
          </button>
          <span>{board.columns.length} {t('designer.total_columns')}</span>
          <span>{totalCards} {t('designer.total_cards')}</span>
        </div>
      </div>

      {/* Toolbar — row 2: search & filter */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-1.5 flex items-center gap-2 flex-wrap">
        <input
          type="search"
          className="input text-xs py-1 w-44"
          placeholder={t('designer.search_placeholder')}
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
        <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.filter_color')}:</span>
        {CARD_COLORS.map(c => (
          <button
            key={c.stem}
            style={{ backgroundColor: c.hex }}
            onClick={() => setFilterColor(filterColor === c.stem ? '' : c.stem)}
            className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 ${
              filterColor === c.stem ? 'border-gray-700 scale-110' : 'border-white'
            }`}
            title={c.stem}
          />
        ))}
        {hasSwimlanes && (
          <>
            <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.filter_lane')}:</span>
            <select
              className="text-xs border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-brand-400"
              value={filterLane}
              onChange={e => setFilterLane(e.target.value)}
            >
              <option value="">—</option>
              {board.swimLanes.map(lane => (
                <option key={lane} value={lane}>{lane}</option>
              ))}
              <option value="__none__">{t('designer.swim_lane_none')}</option>
            </select>
          </>
        )}
        {boardTags.length > 0 && (
          <>
            <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.filter_tag')}:</span>
            <select
              className="text-xs border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-brand-400"
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
            >
              <option value="">—</option>
              {boardTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </>
        )}
        {teamMembers.length > 0 && (
          <>
            <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.filter_assignee')}:</span>
            <select
              className="text-xs border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-brand-400"
              value={filterAssignee}
              onChange={e => setFilterAssignee(e.target.value)}
            >
              <option value="">—</option>
              {teamMembers.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__unassigned__">{t('designer.unassigned')}</option>
            </select>
          </>
        )}
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded px-2 py-0.5 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            ✕ {t('designer.clear_filters')}
          </button>
        )}
      </div>

      {/* Swim lanes management bar */}
      {hasSwimlanes && (
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-1.5 flex gap-2 items-center">
          {board.swimLanes.map(lane => (
            <div key={lane} className="flex items-center gap-1">
              <span className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-gray-600 dark:text-gray-300">{lane}</span>
              <button onClick={() => patch({ swimLanes: board.swimLanes.filter(l => l !== lane) })} title={t('designer.delete_lane')} className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Board canvas */}
      <div ref={boardCanvasRef} id="board-canvas" role="region" aria-label={board.name} className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-950">
        {board.columns.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-600 text-sm">
            {t('designer.no_columns')}
          </div>
        ) : hasSwimlanes ? (
          /* ── Swim lane grid ── */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="min-w-max">
              {/* Column headers row */}
              <div className="flex gap-3 mb-2 ml-32">
                {displayColumns.map(col => (
                  <ColumnHeaderStrip
                    key={col.id}
                    column={col}
                    showWipWarnings={board.showWipWarnings}
                    onRename={name => updateColumn(col.id, { name })}
                    onWipChange={wipLimit => updateColumn(col.id, { wipLimit })}
                    onDelete={() => deleteColumn(col.id)}
                    onCollapse={() => updateColumn(col.id, { collapsed: !col.collapsed })}
                  />
                ))}
              </div>

              {/* Lane rows */}
              {allLanes.map(lane => (
                <div key={lane ?? '__none__'} className="flex gap-3 items-start mb-2">
                  {/* Lane label */}
                  <div className="w-28 flex-shrink-0 self-stretch flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center w-full truncate">
                      {lane ?? t('designer.swim_lane_none')}
                    </span>
                  </div>

                  {/* Column cells for this lane */}
                  {displayColumns.map(col => (
                    <LaneCell
                      key={col.id}
                      column={col}
                      lane={lane}
                      activeLanes={board.swimLanes}
                      collapsed={col.collapsed}
                      swimLanePillNone={t('designer.swim_lane_none')}
                      swimLaneAssign={t('designer.swim_lane_assign')}
                      onAddCard={title => addCard(col.id, title, lane ?? undefined)}
                      onDeleteCard={cardId => deleteCard(col.id, cardId)}
                      onUpdateCard={(cardId, updates) => updateCard(col.id, cardId, updates)}
                      addCardLabel={t('designer.add_card')}
                      cardTitlePlaceholder={t('designer.card_title_placeholder')}
                      deleteCardTitle={t('designer.delete_card')}
                      deleteCardConfirmLabel={t('designer.delete_card_confirm')}
                      cardColorLabel={t('designer.card_color')}
                      noColorLabel={t('designer.no_color')}
                      dueDateLabel={t('designer.due_date')}
                      dueTodayLabel={t('designer.due_today')}
                      overdueLabel={t('designer.overdue')}
                      addTagLabel={t('designer.add_tag')}
                      tagPlaceholderLabel={t('designer.tag_placeholder')}
                      assigneeLabel={t('designer.assignee')}
                      unassignedLabel={t('designer.unassigned')}
                      teamMembers={teamMembers}
                    />
                  ))}
                </div>
              ))}
            </div>
            <DragOverlay>{dragOverlay}</DragOverlay>
          </DndContext>
        ) : (
          /* ── Normal (no swim lanes) layout ── */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={board.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-3 min-w-max">
                {displayColumns.map(col => (
                  <ColumnCard
                    key={col.id}
                    column={col}
                    showWipWarnings={board.showWipWarnings}
                    onRename={name => updateColumn(col.id, { name })}
                    onWipChange={wipLimit => updateColumn(col.id, { wipLimit })}
                    onDelete={() => deleteColumn(col.id)}
                    onCollapse={() => updateColumn(col.id, { collapsed: !col.collapsed })}
                    onAddCard={title => addCard(col.id, title)}
                    onDeleteCard={cardId => deleteCard(col.id, cardId)}
                    onUpdateCard={(cardId, updates) => updateCard(col.id, cardId, updates)}
                    dueDateLabel={t('designer.due_date')}
                    dueTodayLabel={t('designer.due_today')}
                    overdueLabel={t('designer.overdue')}
                    addTagLabel={t('designer.add_tag')}
                    tagPlaceholderLabel={t('designer.tag_placeholder')}
                    assigneeLabel={t('designer.assignee')}
                    unassignedLabel={t('designer.unassigned')}
                    teamMembers={teamMembers}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>{dragOverlay}</DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}
