import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSortable } from '@dnd-kit/sortable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { KanbanColumn, KanbanCard } from '../types'

export type CardUpdates = Partial<Pick<KanbanCard, 'title' | 'color' | 'swimLane'>>

const CARD_COLORS = [
  { stem: 'red',    hex: '#f87171' },
  { stem: 'orange', hex: '#fb923c' },
  { stem: 'yellow', hex: '#facc15' },
  { stem: 'green',  hex: '#4ade80' },
  { stem: 'blue',   hex: '#60a5fa' },
  { stem: 'purple', hex: '#a78bfa' },
]

const colorHex = (stem?: string) => CARD_COLORS.find(c => c.stem === stem)?.hex

interface CardItemProps {
  card: KanbanCard
  onDelete: () => void
  onUpdate: (updates: CardUpdates) => void
  deleteTitle: string
  cardColorLabel: string
  noColorLabel: string
  availableLanes?: string[]
  swimLanePillNone?: string
  swimLaneAssign?: string
}

function CardItem({
  card, onDelete, onUpdate, deleteTitle, cardColorLabel, noColorLabel,
  availableLanes, swimLanePillNone, swimLaneAssign,
}: CardItemProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editColor, setEditColor] = useState<string | undefined>(card.color)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const openEdit = () => {
    setEditTitle(card.title)
    setEditColor(card.color)
    setEditing(true)
  }

  const saveEdit = () => {
    onUpdate({ title: editTitle.trim() || card.title, color: editColor })
    setEditing(false)
  }

  const cycleLane = () => {
    if (!availableLanes) return
    const options: (string | undefined)[] = [...availableLanes, undefined]
    const idx = options.findIndex(l => l === card.swimLane)
    onUpdate({ swimLane: options[(idx + 1) % options.length] })
  }

  const stripe = colorHex(editing ? editColor : card.color)

  if (editing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-lg border border-brand-300 overflow-hidden shadow-sm"
        onPointerDown={e => e.stopPropagation()}
      >
        {stripe && <div style={{ height: 4, backgroundColor: stripe }} />}
        <div className="px-2.5 py-2">
          <input
            autoFocus
            className="w-full text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-brand-400 mb-2"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false) }}
          />
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            <span className="text-xs text-gray-400">{cardColorLabel}:</span>
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
                className="text-xs text-gray-400 hover:text-gray-600"
                title={noColorLabel}
              >✕</button>
            )}
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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden text-xs flex flex-col group shadow-sm cursor-grab active:cursor-grabbing touch-none"
    >
      {stripe && <div style={{ height: 4, backgroundColor: stripe }} />}
      <div className="px-2.5 py-2 flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span
            className="block text-gray-700 leading-snug select-none"
            onDoubleClick={e => { e.stopPropagation(); openEdit() }}
          >
            {card.title}
          </span>
          {availableLanes && availableLanes.length > 0 && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); cycleLane() }}
              className="mt-1 text-xs bg-brand-50 text-brand-600 border border-brand-200 rounded px-1.5 py-0.5 hover:bg-brand-100 max-w-full truncate"
              title={swimLaneAssign}
            >
              {card.swimLane ?? swimLanePillNone ?? '—'}
            </button>
          )}
        </div>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={onDelete}
          title={deleteTitle}
          className="flex-shrink-0 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
}

export function ColumnHeaderStrip({ column, showWipWarnings, onRename, onWipChange, onDelete }: ColumnHeaderStripProps) {
  const { t } = useTranslation()
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState(column.name)

  const isOverWip = showWipWarnings && column.wipLimit !== null && column.cards.length > column.wipLimit

  return (
    <div className={`flex-shrink-0 w-56 bg-white rounded-2xl border-2 flex flex-col transition-colors ${
      isOverWip ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="p-3 flex items-center gap-2">
        {editName ? (
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-white border border-brand-300 rounded px-2 py-0.5 outline-none"
            placeholder={t('designer.column_name_placeholder')}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { onRename(nameVal || column.name); setEditName(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(nameVal || column.name); setEditName(false) } }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 cursor-pointer hover:text-brand-600 truncate"
            onDoubleClick={() => { setNameVal(column.name); setEditName(true) }}
            title={t('designer.rename')}
          >
            {column.name}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${isOverWip ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
        <button onClick={onDelete} title={t('designer.delete_column')} className="text-gray-200 hover:text-red-400 text-xs ml-1">✕</button>
      </div>

      {isOverWip && (
        <div className="mx-3 mb-1 text-xs text-red-600 font-medium">{t('designer.wip_warning')}</div>
      )}

      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">{t('designer.wip_limit')}:</span>
        <input
          type="number"
          min={1}
          max={99}
          placeholder={t('designer.no_limit')}
          className="w-12 text-xs text-center border border-gray-200 rounded px-1 py-0.5 bg-white outline-none focus:border-brand-400"
          value={column.wipLimit ?? ''}
          onChange={e => onWipChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>
    </div>
  )
}

// ── LaneCell ──────────────────────────────────────────────────────────────────
// Card area for one column within a swim lane row.

export interface LaneCellProps {
  column: KanbanColumn
  lane: string | null  // null = "None" (unassigned cards)
  activeLanes: string[]
  swimLanePillNone: string
  swimLaneAssign: string
  onAddCard: (title: string) => void
  onDeleteCard: (cardId: string) => void
  onUpdateCard: (cardId: string, updates: CardUpdates) => void
  addCardLabel: string
  cardTitlePlaceholder: string
  deleteCardTitle: string
  cardColorLabel: string
  noColorLabel: string
}

export function LaneCell({
  column, lane, activeLanes, swimLanePillNone, swimLaneAssign,
  onAddCard, onDeleteCard, onUpdateCard,
  addCardLabel, cardTitlePlaceholder, deleteCardTitle, cardColorLabel, noColorLabel,
}: LaneCellProps) {
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const filteredCards = lane !== null
    ? column.cards.filter(c => c.swimLane === lane)
    : column.cards.filter(c => !c.swimLane)

  return (
    <div className="flex-shrink-0 w-56 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col min-h-[64px]">
      <div className="flex-1 px-2 pt-2 pb-1 space-y-1.5 min-h-[40px]">
        <SortableContext items={filteredCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {filteredCards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(card.id)}
              onUpdate={updates => onUpdateCard(card.id, updates)}
              deleteTitle={deleteCardTitle}
              cardColorLabel={cardColorLabel}
              noColorLabel={noColorLabel}
              availableLanes={activeLanes}
              swimLanePillNone={swimLanePillNone}
              swimLaneAssign={swimLaneAssign}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-2 border-t border-gray-100">
        {addingCard ? (
          <div>
            <input
              autoFocus
              className="w-full text-xs border border-brand-300 rounded px-2 py-1.5 outline-none mb-1.5"
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
              <button onClick={() => { setAddingCard(false); setCardTitle('') }} className="text-xs text-gray-400 px-2 py-1">✕</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-xs text-gray-400 hover:text-brand-600 text-left px-1 py-1 hover:bg-white rounded-lg transition-colors"
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
  onAddCard: (title: string) => void
  onDeleteCard: (cardId: string) => void
  onUpdateCard: (cardId: string, updates: CardUpdates) => void
}

export default function ColumnCard({
  column, showWipWarnings, onRename, onWipChange, onDelete, onAddCard, onDeleteCard, onUpdateCard,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-56 bg-gray-50 rounded-2xl border-2 flex flex-col transition-colors ${
        isOverWip ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      {/* Header — drag handle for column reordering */}
      <div className="p-3 flex items-center gap-2" {...attributes} {...listeners}>
        <div className="cursor-grab text-gray-300 text-sm select-none">⠿</div>
        {editName ? (
          <input
            autoFocus
            className="flex-1 text-sm font-semibold bg-white border border-brand-300 rounded px-2 py-0.5 outline-none"
            placeholder={t('designer.column_name_placeholder')}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { onRename(nameVal || column.name); setEditName(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(nameVal || column.name); setEditName(false) } }}
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 cursor-pointer hover:text-brand-600 truncate"
            onDoubleClick={() => { setNameVal(column.name); setEditName(true) }}
            title={t('designer.rename')}
          >
            {column.name}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-lg ${isOverWip ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
          {column.cards.length}{column.wipLimit !== null ? `/${column.wipLimit}` : ''}
        </span>
        <button onClick={onDelete} title={t('designer.delete_column')} className="text-gray-200 hover:text-red-400 text-xs ml-1">✕</button>
      </div>

      {isOverWip && (
        <div className="mx-3 mb-1 text-xs text-red-600 font-medium">{t('designer.wip_warning')}</div>
      )}

      {/* WIP limit */}
      <div className="px-3 pb-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">{t('designer.wip_limit')}:</span>
        <input
          type="number"
          min={1}
          max={99}
          placeholder={t('designer.no_limit')}
          className="w-12 text-xs text-center border border-gray-200 rounded px-1 py-0.5 bg-white outline-none focus:border-brand-400"
          value={column.wipLimit ?? ''}
          onChange={e => onWipChange(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      {/* Cards — vertical sortable per column */}
      <div className="flex-1 px-2 pb-2 space-y-1.5 min-h-[40px]">
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(card.id)}
              onUpdate={updates => onUpdateCard(card.id, updates)}
              deleteTitle={t('designer.delete_card')}
              cardColorLabel={t('designer.card_color')}
              noColorLabel={t('designer.no_color')}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      <div className="p-2 border-t border-gray-200">
        {addingCard ? (
          <div>
            <input
              autoFocus
              className="w-full text-xs border border-brand-300 rounded px-2 py-1.5 outline-none mb-1.5"
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
              <button onClick={() => { setAddingCard(false); setCardTitle('') }} className="text-xs text-gray-400 px-2 py-1">✕</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-xs text-gray-400 hover:text-brand-600 text-left px-1 py-1 hover:bg-white rounded-lg transition-colors"
          >
            + {t('designer.add_card')}
          </button>
        )}
      </div>
    </div>
  )
}
