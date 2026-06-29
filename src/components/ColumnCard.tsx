import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSortable } from '@dnd-kit/sortable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KanbanColumn, KanbanCard } from '../types'

export type CardUpdates = Partial<Pick<KanbanCard, 'title' | 'color' | 'swimLane' | 'dueDate' | 'tags'>>

function dueDateBadge(dueDate: string, todayLabel: string, overdueLabel: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + 'T00:00:00')
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000)
  const label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  if (diffDays < 0) return { label: overdueLabel + ' · ' + label, cls: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-bold' }
  if (diffDays === 0) return { label: todayLabel + ' · ' + label, cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold' }
  return { label, cls: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' }
}

const CARD_COLORS = [
  { stem: 'red',    hex: '#f87171' },
  { stem: 'orange', hex: '#fb923c' },
  { stem: 'yellow', hex: '#facc15' },
  { stem: 'green',  hex: '#4ade80' },
  { stem: 'blue',   hex: '#60a5fa' },
  { stem: 'purple', hex: '#a78bfa' },
]

const colorHex = (stem?: string) => CARD_COLORS.find(c => c.stem === stem)?.hex

function WipBar({ cardCount, wipLimit, tooltip }: { cardCount: number; wipLimit: number | null; tooltip: string }) {
  if (!wipLimit) return null
  const ratio = cardCount / wipLimit
  const fillPct = Math.min(ratio * 100, 100)
  const barClass =
    ratio >= 1   ? 'bg-red-500 animate-pulse' :
    ratio >= 0.9 ? 'bg-orange-400' :
    ratio >= 0.6 ? 'bg-amber-400' :
                   'bg-green-400'
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700" style={{ height: 4 }} title={tooltip}>
      <div className={`h-full transition-all duration-300 ${barClass}`} style={{ width: `${fillPct}%` }} />
    </div>
  )
}

interface CardItemProps {
  card: KanbanCard
  onDelete: () => void
  onUpdate: (updates: CardUpdates) => void
  deleteTitle: string
  deleteCardConfirmLabel: string
  cardColorLabel: string
  noColorLabel: string
  dueDateLabel: string
  dueTodayLabel: string
  overdueLabel: string
  addTagLabel: string
  tagPlaceholderLabel: string
  availableLanes?: string[]
  swimLanePillNone?: string
  swimLaneAssign?: string
}

function CardItem({
  card, onDelete, onUpdate, deleteTitle, deleteCardConfirmLabel,
  cardColorLabel, noColorLabel, dueDateLabel, dueTodayLabel, overdueLabel,
  addTagLabel, tagPlaceholderLabel,
  availableLanes, swimLanePillNone, swimLaneAssign,
}: CardItemProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editColor, setEditColor] = useState<string | undefined>(card.color)
  const [editDueDate, setEditDueDate] = useState<string>(card.dueDate ?? '')
  const [editTags, setEditTags] = useState<string[]>(card.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const openEdit = () => {
    setEditTitle(card.title)
    setEditColor(card.color)
    setEditDueDate(card.dueDate ?? '')
    setEditTags(card.tags ?? [])
    setTagInput('')
    setEditing(true)
  }

  const saveEdit = () => {
    onUpdate({
      title: editTitle.trim() || card.title,
      color: editColor,
      dueDate: editDueDate || undefined,
      tags: editTags.length > 0 ? editTags : undefined,
    })
    setEditing(false)
  }

  const cycleLane = () => {
    if (!availableLanes) return
    const options: (string | undefined)[] = [...availableLanes, undefined]
    const idx = options.findIndex(l => l === card.swimLane)
    onUpdate({ swimLane: options[(idx + 1) % options.length] })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault()
      e.stopPropagation()
      openEdit()
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      e.stopPropagation()
      if (confirmDelete) {
        if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
        setConfirmDelete(false)
        onDelete()
      } else {
        setConfirmDelete(true)
        confirmTimerRef.current = setTimeout(() => setConfirmDelete(false), 2000)
      }
    } else if (e.key === 'Escape' && confirmDelete) {
      e.preventDefault()
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
      setConfirmDelete(false)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopPropagation()
      const list = e.currentTarget.closest('[role="list"]')
      if (!list) return
      const items = Array.from(list.querySelectorAll<HTMLElement>('[role="listitem"]'))
      const idx = items.indexOf(e.currentTarget)
      if (idx === -1) return
      const next = e.key === 'ArrowDown' ? items[idx + 1] : items[idx - 1]
      next?.focus()
    }
  }

  const stripe = colorHex(editing ? editColor : card.color)

  if (editing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        role="listitem"
        aria-label={card.title}
        className="bg-white dark:bg-gray-800 rounded-lg border border-brand-300 dark:border-brand-700 overflow-hidden shadow-sm"
        onPointerDown={e => e.stopPropagation()}
      >
        {stripe && <div style={{ height: 4, backgroundColor: stripe }} />}
        <div className="px-2.5 py-2">
          <input
            autoFocus
            className="w-full text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-2 py-1 outline-none focus:border-brand-400 mb-2"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false) }}
          />
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500">{cardColorLabel}:</span>
            {CARD_COLORS.map(c => (
              <button
                key={c.stem}
                style={{ backgroundColor: c.hex }}
                className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-110 ${
                  editColor === c.stem ? 'border-gray-700 scale-110' : 'border-white'
                }`}
                onClick={() => setEditColor(editColor === c.stem ? undefined : c.stem)}
                title={c.stem}
              />
            ))}
            {editColor && (
              <button
                onClick={() => setEditColor(undefined)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                title={noColorLabel}
              >✕</button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">{dueDateLabel}:</span>
            <input
              type="date"
              className="text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-brand-400"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
            />
            {editDueDate && (
              <button
                onClick={() => setEditDueDate('')}
                className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                title={noColorLabel}
              >✕</button>
            )}
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{addTagLabel}:</div>
            <div className="flex flex-wrap gap-1">
              {editTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-0.5 text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 rounded px-1.5 py-0.5">
                  {tag}
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => setEditTags(editTags.filter(t => t !== tag))}
                    className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200 leading-none ml-0.5"
                  >✕</button>
                </span>
              ))}
              <input
                className="text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-brand-400 w-24"
                placeholder={tagPlaceholderLabel}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const t = tagInput.trim()
                    if (t && !editTags.includes(t)) setEditTags([...editTags, t])
                    setTagInput('')
                  }
                }}
              />
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={saveEdit} className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded">✓</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-400 px-2 py-0.5">✕</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="listitem"
      aria-label={card.title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden text-xs flex flex-col group shadow-sm cursor-grab active:cursor-grabbing touch-none focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
        confirmDelete ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {stripe && <div style={{ height: 4, backgroundColor: stripe }} />}
      {confirmDelete && (
        <div className="px-2.5 pt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">{deleteCardConfirmLabel}</div>
      )}
      <div className="px-2.5 py-2 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span
            className="block text-gray-700 dark:text-gray-200 leading-snug select-none"
            onDoubleClick={e => { e.stopPropagation(); openEdit() }}
          >
            {card.title}
          </span>
          {card.dueDate && (() => {
            const badge = dueDateBadge(card.dueDate, dueTodayLabel, overdueLabel)
            return (
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); openEdit() }}
                className={`mt-1 text-xs rounded px-1.5 py-0.5 max-w-full truncate ${badge.cls}`}
              >
                {badge.label}
              </button>
            )
          })()}
          {availableLanes && availableLanes.length > 0 && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); cycleLane() }}
              className="mt-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 rounded px-1.5 py-0.5 hover:bg-brand-100 dark:hover:bg-brand-900/40 max-w-full truncate"
              title={swimLaneAssign}
            >
              {card.swimLane ?? swimLanePillNone ?? '—'}
            </button>
          )}
          {card.tags && card.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {card.tags.map(tag => (
                <span key={tag} className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 rounded px-1.5 py-0.5 select-none">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={onDelete}
          title={deleteTitle}
          className="flex-shrink-0 text-gray-200 dark:text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ── ColumnHeaderStrip ─────────────────────────────────────────────────────────
// Column header only (no cards) — used in the swim lane grid layout.

export interface ColumnHeaderStripProps {
  column: KanbanColumn
  showWipWarnings: boolean
  onRename: (name: string) => void
  onWipChange: (limit: number | null) => void
  onDelete: () => void
  onCollapse: () => void
}

export function ColumnHeaderStrip({ column, showWipWarnings, onRename, onWipChange, onDelete, onCollapse }: ColumnHeaderStripProps) {
  const { t } = useTranslation()
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState(column.name)

  const isOverWip = showWipWarnings && column.wipLimit !== null && column.cards.length > column.wipLimit
  const wipTooltip = column.wipLimit
    ? t('designer.wip_utilisation_tooltip', {
        count: column.cards.length,
        limit: column.wipLimit,
        pct: Math.round((column.cards.length / column.wipLimit) * 100),
      })
    : ''

  if (column.collapsed) {
    return (
      <div className={`flex-shrink-0 w-12 bg-white dark:bg-gray-900 rounded-2xl border-2 flex flex-col items-center py-2 transition-colors ${
        isOverWip ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <button
          onClick={onCollapse}
          title={t('designer.expand_column')}
          className="text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >»</button>
        <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
          <span
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '120px', overflow: 'hidden' }}
          >
            {column.name}
          </span>
        </div>
        <span className={`text-xs font-medium px-1 py-0.5 rounded-lg ${
          isOverWip ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex-shrink-0 w-56 bg-white dark:bg-gray-900 rounded-2xl border-2 flex flex-col transition-colors ${
      isOverWip ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="p-3 flex items-center gap-2">
        <button
          onClick={onCollapse}
          title={t('designer.collapse_column')}
          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-xs font-bold leading-none flex-shrink-0"
        >«</button>
        {editName ? (
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-brand-300 dark:border-brand-700 rounded px-2 py-0.5 outline-none"
            placeholder={t('designer.column_name_placeholder')}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { onRename(nameVal || column.name); setEditName(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(nameVal || column.name); setEditName(false) } }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 truncate"
            onDoubleClick={() => { setNameVal(column.name); setEditName(true) }}
            title={t('designer.rename')}
          >
            {column.name}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${isOverWip ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
        <button onClick={onDelete} title={t('designer.delete_column')} className="text-gray-200 dark:text-gray-600 hover:text-red-400 text-xs ml-1">✕</button>
      </div>

      {isOverWip && (
        <div className="mx-3 mb-1 text-xs text-red-600 dark:text-red-400 font-medium">{t('designer.wip_warning')}</div>
      )}

      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.wip_limit')}:</span>
        <input
          type="number"
          min={1}
          max={99}
          placeholder={t('designer.no_limit')}
          className="w-12 text-xs text-center border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-brand-400"
          value={column.wipLimit ?? ''}
          onChange={e => onWipChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <WipBar cardCount={column.cards.length} wipLimit={column.wipLimit} tooltip={wipTooltip} />
    </div>
  )
}

// ── LaneCell ──────────────────────────────────────────────────────────────────
// Card area for one column within a swim lane row.

export interface LaneCellProps {
  column: KanbanColumn
  lane: string | null  // null = "None" (unassigned cards)
  activeLanes: string[]
  collapsed?: boolean
  swimLanePillNone: string
  swimLaneAssign: string
  onAddCard: (title: string) => void
  onDeleteCard: (cardId: string) => void
  onUpdateCard: (cardId: string, updates: CardUpdates) => void
  addCardLabel: string
  cardTitlePlaceholder: string
  deleteCardTitle: string
  deleteCardConfirmLabel: string
  cardColorLabel: string
  noColorLabel: string
  dueDateLabel: string
  dueTodayLabel: string
  overdueLabel: string
  addTagLabel: string
  tagPlaceholderLabel: string
}

export function LaneCell({
  column, lane, activeLanes, collapsed,
  swimLanePillNone, swimLaneAssign,
  onAddCard, onDeleteCard, onUpdateCard,
  addCardLabel, cardTitlePlaceholder, deleteCardTitle, deleteCardConfirmLabel,
  cardColorLabel, noColorLabel, dueDateLabel, dueTodayLabel, overdueLabel,
  addTagLabel, tagPlaceholderLabel,
}: LaneCellProps) {
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const filteredCards = lane !== null
    ? column.cards.filter(c => c.swimLane === lane)
    : column.cards.filter(c => !c.swimLane)

  if (collapsed) {
    return (
      <div className="flex-shrink-0 w-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center min-h-[64px]">
        {filteredCards.length > 0 && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{filteredCards.length}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 w-56 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col min-h-[64px]">
      <div className="flex-1 px-2 pt-2 pb-1 space-y-1.5 min-h-[40px]" role="list" aria-label={column.name}>
        <SortableContext items={filteredCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {filteredCards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(card.id)}
              onUpdate={updates => onUpdateCard(card.id, updates)}
              deleteTitle={deleteCardTitle}
              deleteCardConfirmLabel={deleteCardConfirmLabel}
              cardColorLabel={cardColorLabel}
              noColorLabel={noColorLabel}
              dueDateLabel={dueDateLabel}
              dueTodayLabel={dueTodayLabel}
              overdueLabel={overdueLabel}
              addTagLabel={addTagLabel}
              tagPlaceholderLabel={tagPlaceholderLabel}
              availableLanes={activeLanes}
              swimLanePillNone={swimLanePillNone}
              swimLaneAssign={swimLaneAssign}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-2 border-t border-gray-100 dark:border-gray-800">
        {addingCard ? (
          <div>
            <input
              autoFocus
              className="w-full text-xs border border-brand-300 dark:border-brand-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1.5 outline-none mb-1.5"
              placeholder={cardTitlePlaceholder}
              value={cardTitle}
              onChange={e => setCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && cardTitle.trim()) {
                  onAddCard(cardTitle.trim())
                  setCardTitle('')
                  setAddingCard(false)
                }
                if (e.key === 'Escape') setAddingCard(false)
              }}
            />
            <div className="flex gap-1">
              <button
                onClick={() => { if (cardTitle.trim()) { onAddCard(cardTitle.trim()); setCardTitle('') }; setAddingCard(false) }}
                className="text-xs bg-brand-600 text-white px-2 py-1 rounded-lg"
              >Add</button>
              <button onClick={() => { setAddingCard(false); setCardTitle('') }} className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">✕</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-xs text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 text-left px-1 py-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            + {addCardLabel}
          </button>
        )}
      </div>
    </div>
  )
}

// ── ColumnCard ────────────────────────────────────────────────────────────────
// Full column component (header + cards) used when no swim lanes are active.

interface Props {
  column: KanbanColumn
  showWipWarnings: boolean
  onRename: (name: string) => void
  onWipChange: (limit: number | null) => void
  onDelete: () => void
  onCollapse: () => void
  onAddCard: (title: string) => void
  onDeleteCard: (cardId: string) => void
  onUpdateCard: (cardId: string, updates: CardUpdates) => void
  dueDateLabel: string
  dueTodayLabel: string
  overdueLabel: string
  addTagLabel: string
  tagPlaceholderLabel: string
}

export default function ColumnCard({
  column, showWipWarnings, onRename, onWipChange, onDelete, onCollapse, onAddCard, onDeleteCard, onUpdateCard,
  dueDateLabel, dueTodayLabel, overdueLabel, addTagLabel, tagPlaceholderLabel,
}: Props) {
  const { t } = useTranslation()
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState(column.name)
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverWip = showWipWarnings && column.wipLimit !== null && column.cards.length > column.wipLimit

  // Collapsed state — narrow vertical strip with drag-reorder still active
  if (column.collapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex-shrink-0 w-12 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 flex flex-col items-center py-2 transition-colors ${
          isOverWip ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div {...attributes} {...listeners} className="cursor-grab text-gray-300 dark:text-gray-600 text-sm select-none mb-1">⠿</div>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onCollapse() }}
          title={t('designer.expand_column')}
          className="text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >»</button>
        <div className="flex-1 flex items-center justify-center my-2 overflow-hidden">
          <span
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: '120px', overflow: 'hidden' }}
          >
            {column.name}
          </span>
        </div>
        <span className={`text-xs font-medium px-1 py-0.5 rounded-lg ${
          isOverWip
            ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
      </div>
    )
  }

  const wipTooltip = column.wipLimit
    ? t('designer.wip_utilisation_tooltip', {
        count: column.cards.length,
        limit: column.wipLimit,
        pct: Math.round((column.cards.length / column.wipLimit) * 100),
      })
    : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-56 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 flex flex-col transition-colors ${
        isOverWip ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header — drag handle for column reordering */}
      <div className="p-3 flex items-center gap-2" {...attributes} {...listeners}>
        <div className="cursor-grab text-gray-300 dark:text-gray-600 text-sm select-none">⠿</div>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onCollapse() }}
          title={t('designer.collapse_column')}
          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-xs font-bold leading-none flex-shrink-0"
        >«</button>
        {editName ? (
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-brand-300 dark:border-brand-700 rounded px-2 py-0.5 outline-none"
            placeholder={t('designer.column_name_placeholder')}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { onRename(nameVal || column.name); setEditName(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(nameVal || column.name); setEditName(false) } }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 truncate"
            onDoubleClick={() => { setNameVal(column.name); setEditName(true) }}
            title={t('designer.rename')}
          >
            {column.name}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${isOverWip ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
        <button onClick={onDelete} title={t('designer.delete_column')} className="text-gray-200 dark:text-gray-600 hover:text-red-400 text-xs ml-1">✕</button>
      </div>

      {isOverWip && (
        <div className="mx-3 mb-1 text-xs text-red-600 dark:text-red-400 font-medium">{t('designer.wip_warning')}</div>
      )}

      {/* WIP limit */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">{t('designer.wip_limit')}:</span>
        <input
          type="number"
          min={1}
          max={99}
          placeholder={t('designer.no_limit')}
          className="w-12 text-xs text-center border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:border-brand-400"
          value={column.wipLimit ?? ''}
          onChange={e => onWipChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <WipBar cardCount={column.cards.length} wipLimit={column.wipLimit} tooltip={wipTooltip} />

      {/* Cards — vertical sortable per column */}
      <div className="flex-1 px-2 pb-2 space-y-1.5 min-h-[40px]" role="list" aria-label={column.name}>
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(card.id)}
              onUpdate={updates => onUpdateCard(card.id, updates)}
              deleteTitle={t('designer.delete_card')}
              deleteCardConfirmLabel={t('designer.delete_card_confirm')}
              cardColorLabel={t('designer.card_color')}
              noColorLabel={t('designer.no_color')}
              dueDateLabel={dueDateLabel}
              dueTodayLabel={dueTodayLabel}
              overdueLabel={overdueLabel}
              addTagLabel={addTagLabel}
              tagPlaceholderLabel={tagPlaceholderLabel}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        {addingCard ? (
          <div>
            <input
              autoFocus
              className="w-full text-xs border border-brand-300 dark:border-brand-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1.5 outline-none mb-1.5"
              placeholder={t('designer.card_title_placeholder')}
              value={cardTitle}
              onChange={e => setCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && cardTitle.trim()) {
                  onAddCard(cardTitle.trim())
                  setCardTitle('')
                  setAddingCard(false)
                }
                if (e.key === 'Escape') setAddingCard(false)
              }}
            />
            <div className="flex gap-1">
              <button
                onClick={() => { if (cardTitle.trim()) { onAddCard(cardTitle.trim()); setCardTitle('') }; setAddingCard(false) }}
                className="text-xs bg-brand-600 text-white px-2 py-1 rounded-lg"
              >Add</button>
              <button onClick={() => { setAddingCard(false); setCardTitle('') }} className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">✕</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-xs text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 text-left px-1 py-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            + {t('designer.add_card')}
          </button>
        )}
      </div>
    </div>
  )
}
